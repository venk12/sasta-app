#!/usr/bin/env python
# coding: utf-8

# ### Current Working:
# 
# This code is designed to extract offers and discounts from supermarket pamphlets. The current workflow is as follows:
# 
# 1. The PDF file is accessed from `/catalog_pdf/<supermarket>`.
# 2. The PDF is converted to images step by step and encoded in UTF-8 format and stored in `/catalog_images/<supermarket>`
# 3. The encoded content is sent to the OpenAI API with a specific prompt or instructions.
# 4. The API's response, received as a JSON, is converted into a table (dataframe) and stored locally.
# 
# ### Yet to be developed:    
# 1. The current approach may not be sustainable in the long run due to reliance on the OpenAI API. Exploring open-source models could be a viable alternative.
# 2. Sometimes, characters are not accurately recognized (e.g., the number "1" from Jumbo).
# 3. The automation of the full process (with modularity), from scraping the relevant websites weekly to creating the database, is yet to be developed.
# 4. There are some pages in these pamphlet - which do not have any information - we need to ignore/discard them
# 5. Integration with the main app

# In[2]:


import base64
import requests
import pandas as pd
import io
import json
import os

from pdf2image import convert_from_path
import os


# In[7]:


# Path to your PDF file
# Now we take an example of Lidl. This needs to be automated for every supermarket

sample_pdf_path = './catalog_pdf/Lidl/lidl_sample.pdf'

# Path to save images
save_images_path = './catalog_images/Lidl'


# In[9]:


# Create the directory if it doesn't exist
if not os.path.exists(save_images_path):
    os.makedirs(save_images_path)

# Convert PDF to images
pages = convert_from_path(sample_pdf_path)

# Save each page as an image in the folder
for i, page in enumerate(pages):
    image_path = os.path.join(save_images_path, f'page_{i + 1}.png')
    page.save(image_path, 'PNG')
    print(f"Saving page {i + 1} to {image_path}")


# In[10]:


# Now we take an example page from above. This needs to be automated for every page

sample_image_path = "./catalog_images/Lidl/page_3.png"
sample_data_save_path = "./catalog_data/Lidl/"


# In[11]:


# Function to encode the image

def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')


# In[12]:


# Getting the base64 string

base64_image = encode_image(sample_image_path)


# In[13]:


openai_api_key="sk-JCguguFQg0yjwHTDNx2J90CrGku2a0iZf02HgYInRGT3BlbkFJpgN49P5MfDGiOa7pN-7h8_0A581s0VpHkap-F7BPoA"


# In[14]:


headers = {
  "Content-Type": "application/json",
  "Authorization": f"Bearer {openai_api_key}"
}

payload = {
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": f"Extract the product names, product weight/volume,"
                    "quantity, discount price and discount type (if any) from the image"
                    "and produce only a json output"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": f"data:image/jpeg;base64,{base64_image}"
          }
        }
      ]
    }
  ],
  "max_tokens": 300
}

response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)


# In[16]:


# Extract the JSON content from the response
response_json = response.json()
extracted_content = response_json['choices'][0]['message']['content']

# Debugging: Print the extracted content to ensure it's correct
# print("Extracted Content:")
# print(extracted_content)

# Remove the markdown code block notation from the content
json_content = extracted_content.strip().strip('```json').strip('```')
data_lidl = json.loads(json_content)
df_lidl = pd.DataFrame(data_lidl)
df_lidl.to_csv(sample_data_save_path + 'lidl_catalog_data.csv', index=False)


# **Next steps:**
# 1. We need to finish the script for all supermarkets.
# 2. Develop a method to combine everything into a single database.
# 3. Integrate the database with the app to display all information in one place for the user.
