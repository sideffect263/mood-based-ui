import axios from 'axios';

const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

// Store previously used object IDs to avoid duplicates across pages
let usedObjectIds = new Set();

// Fetch a limited set of object IDs (optionally filtered by department)
export const fetchObjectIds = async (departmentIds = null, limit = 100) => {
  try {
    let url = `${BASE_URL}/objects`;
    
    if (departmentIds) {
      url += `?departmentIds=${departmentIds}`;
    }
    
    const response = await axios.get(url);
    
    // Return only a subset of IDs to avoid too many requests
    return response.data.objectIDs.slice(0, limit);
  } catch (error) {
    console.error('Error fetching object IDs:', error);
    throw error;
  }
};

// Fetch details for a specific object
export const fetchObjectDetails = async (objectId) => {
  try {
    const response = await axios.get(`${BASE_URL}/objects/${objectId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching object ${objectId} details:`, error);
    throw error;
  }
};

// Fetch departments from the Met Museum API
export const fetchDepartments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/departments`);
    return response.data.departments;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

// Fetch multiple objects with details and transform to app format
export const fetchArtworks = async (departmentIds = null, targetCount = 20, page = 1, randomize = false) => {
  try {
    // Get a larger set of object IDs to increase our chances of finding objects with images
    const initialLimit = targetCount * 10; // Fetch 10x the number we need
    let objectIds = await fetchObjectIds(departmentIds, initialLimit * (page > 1 ? 3 : 1));
    
    // Filter out IDs we've already used in previous pages
    if (page === 1) {
      // Reset used IDs when starting fresh
      usedObjectIds = new Set();
    } else {
      objectIds = objectIds.filter(id => !usedObjectIds.has(id));
    }
    
    // Randomize the order if requested
    if (randomize) {
      objectIds = objectIds.sort(() => Math.random() - 0.5);
    }
    
    let objectsWithImages = [];
    let processedCount = 0;
    const batchSize = 20; // Process in smaller batches
    
    // Process in batches until we have enough items with images or run out of IDs
    while (objectsWithImages.length < targetCount && processedCount < objectIds.length) {
      const currentBatch = objectIds.slice(processedCount, processedCount + batchSize);
      processedCount += batchSize;
      
      // Fetch details for current batch (in parallel)
      const batchDetailsPromises = currentBatch.map(id => fetchObjectDetails(id));
      const batchDetails = await Promise.all(batchDetailsPromises);
      
      // Filter to only objects with images and in public domain
      const batchWithImages = batchDetails.filter(obj => 
        obj.primaryImage && obj.primaryImage.length > 0 && obj.isPublicDomain
      );
      
      objectsWithImages = [...objectsWithImages, ...batchWithImages];
      
      console.log(`Page ${page}: Processed ${processedCount}/${objectIds.length} objects, found ${objectsWithImages.length}/${targetCount} with images`);
      
      // If we've processed a lot of objects and still don't have enough, just return what we have
      if (processedCount >= 100 && objectsWithImages.length > 0) {
        break;
      }
    }
    
    // Fall back to showing items without images if we couldn't find enough with images
    if (objectsWithImages.length === 0) {
      console.warn("Couldn't find any objects with images, falling back to objects without images");
      const fallbackDetailsPromises = objectIds.slice(0, 20).map(id => fetchObjectDetails(id));
      objectsWithImages = await Promise.all(fallbackDetailsPromises);
    }

    // Add successfully fetched IDs to our used IDs set
    objectsWithImages.forEach(obj => usedObjectIds.add(obj.objectID));
    
    // Transform to the format expected by the app
    return objectsWithImages.slice(0, targetCount).map((obj) => ({
      id: obj.objectID,
      image: obj.primaryImage || 'https://via.placeholder.com/500?text=No+Image+Available',
      title: obj.title || 'Untitled',
      artist: obj.constituents ? obj.constituents.map(c => c.name).join(', ') : 'Unknown',
      category: obj.department || 'Uncategorized',
      culture: obj.culture || '',
      period: obj.period || '',
      additionalImages: obj.additionalImages || [],
      isPublicDomain: obj.isPublicDomain
    }));
  } catch (error) {
    console.error('Error fetching artworks:', error);
    throw error;
  }
};

// Get unique categories from fetched artworks
export const extractCategories = (artworks) => {
  const categories = artworks.map(artwork => artwork.category);
  return ['All', ...new Set(categories)];
}; 