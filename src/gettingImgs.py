import requests
from bs4 import BeautifulSoup
import time
import re

def scrape_art_images(url, num_images=100):
    headers = {'User-Agent': 'Your User Agent String'}
    artworks = []
    
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    gallery = soup.find('ul', class_='gallery')
    if gallery:
        for i, li in enumerate(gallery.find_all('li', class_='gallerybox'), 1):
            if i > num_images:
                break
            
            artwork = {'id': i}
            
            # Find image
            img = li.find('img')
            if img and 'src' in img.attrs:
                artwork['image'] = '' + img['src']
            
            # Find title
            title_elem = li.find('div', class_='gallerytext')
            if title_elem:
                artwork['title'] = title_elem.get_text(strip=True)
            
            # Get more details from the file page
            link = li.find('a', class_='galleryfilename')
            if link:
                file_url = 'https://commons.wikimedia.org' + link['href']
                artwork.update(get_artwork_details(file_url, headers))
            
            artworks.append(artwork)
            time.sleep(1)  # Be polite, wait between requests
    
    return artworks

def get_artwork_details(url, headers):
    details = {'artist': '', 'category': ''}
    
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Try to find artist
    artist_elem = soup.find('td', string='Artist')
    if artist_elem:
        artist = artist_elem.find_next('td')
        if artist:
            details['artist'] = artist.get_text(strip=True)
    
    # Try to find category
    for link in soup.find_all('a'):
        if 'title' in link.attrs and link['title'].startswith('Category:'):
            details['category'] = link['title'].split(':')[1]
            break
    
    return details

# Example usage
url = 'https://commons.wikimedia.org/wiki/Category:Paintings'
artworks = scrape_art_images(url, num_images=10)
for artwork in artworks:
    print(artwork)
    
import re

def clean_data(artworks):
    cleaned_artworks = []
    for artwork in artworks:
        cleaned_artwork = {
            'id': artwork['id'],
            'title': clean_title(artwork['title']),
            'artist': artwork['artist'] if artwork['artist'] else 'Unknown',
            'category': artwork['category'],
            'image': clean_image_url(artwork['image'])
        }
        cleaned_artworks.append(cleaned_artwork)
    return cleaned_artworks

def clean_title(title):
    # Remove file extension and dimensions
    title = re.sub(r'\.\w+$', '', title)  # Remove file extension
    title = re.sub(r'\d+\s*×\s*\d+.*$', '', title)  # Remove dimensions
    title = title.strip()
    return title

def clean_image_url(url):
    # Remove the duplicate 'https:'
    if url.startswith('https:https://'):
        url = url[6:]
    return url

# Assuming your original data is in a variable called 'original_artworks'
cleaned_artworks = clean_data(artworks)

# Print the cleaned data
import json
print(json.dumps(cleaned_artworks, indent=2))



# Save the data to a file

import json

with open('artworks.json', 'w') as file:
    
    json.dump(artworks, file, indent=2)
    
    