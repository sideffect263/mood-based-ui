import requests
from bs4 import BeautifulSoup

def get_image_links(page_url, headers):
    response = requests.get(page_url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    image_links = []
    print(f'Getting images from {soup.prettify()}')
    for img in soup.find_all('img'):
        img_url = img.get('data-src') or img.get('src')
        if img_url:
            image_links.append(img_url)
    return image_links

# URL of the search page
base_url = 'https://unsplash.com/s/photos/artwork'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

# List to store image links
image_links = []

# Loop through pages to get image links
page = 1
while len(image_links) < 100:
    current_page = f"{base_url}{page}"
    page_image_links = get_image_links(current_page, headers)
    image_links.extend(page_image_links)
    
    # Break if there are no more image links found
    if len(page_image_links) == 0:
        break
    
    # Go to the next page
    page += 1

    # Ensure we only collect 100 links
    if len(image_links) >= 100:
        image_links = image_links[:100]
        break

# Save the image links to a file
with open('image_links.txt', 'w') as file:
    for link in image_links:
        file.write(f'{link}\n')

print('Saved 100 image links to image_links.txt')
