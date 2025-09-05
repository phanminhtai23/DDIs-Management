# """Chuyen file PDF sang anh PNG"""

import pytesseract
import os
import cv2
import numpy as np
import pdfplumber
from PIL import Image, ImageEnhance, ImageFilter

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

pdf_folder = "ThuocPDF1/"
save_temp_image_path_1 = "datatest/0/"
save_temp_image_path_2 = "datatest/temp/"

def is_pure_text_image(image):
    text = pytesseract.image_to_string(image)
    return bool(text.strip()) and not contains_image(image)

def contains_image(image):
    # Implement a method to check if the image contains non-text elements
    # This is a placeholder function and should be implemented based on specific requirements
    return False

def pdf_to_images(pdf_path, output_folder):
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            page_image = page.to_image(resolution=300)
            image = page_image.original

            if is_pure_text_image(image):
                image_path = os.path.join(output_folder, f"{os.path.basename(pdf_path)[:-4]}_page_{i + 1}.png")
                page_image.save(image_path)
                print(f"Saved page {i + 1} of {os.path.basename(pdf_path)} as image: {image_path}")
            else:
                print(f"Deleted page {i + 1} of {os.path.basename(pdf_path)} due to non-text content")

def process_multiple_pdfs(pdf_folder, output_folder_1, output_folder_2, num_files=53):
    pdf_files = [f for f in os.listdir(pdf_folder) if f.endswith('.pdf')]
    for idx, pdf_file in enumerate(pdf_files):
        pdf_path = os.path.join(pdf_folder, pdf_file)
        if idx < num_files:
            pdf_to_images(pdf_path, output_folder_1)
        elif idx < 2 * num_files:
            pdf_to_images(pdf_path, output_folder_2)
        else:
            break

# Chạy hàm để xử lý 20 file PDF đầu tiên, 10 file đầu lưu vào data1, 10 file tiếp theo lưu vào data2
process_multiple_pdfs(pdf_folder, save_temp_image_path_1, save_temp_image_path_2)


"""Xoay ảnh 180 độ"""

import os
from PIL import Image

# Increase the maximum image pixels limit
Image.MAX_IMAGE_PIXELS = None

def rotate_images_in_folder(folder_path):
    for filename in os.listdir(folder_path):
        if filename.endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif')):
            image_path = os.path.join(folder_path, filename)
            with Image.open(image_path) as img:
                rotated_img = img.rotate(180)
                rotated_img.save(image_path)
                print(f"Rotated {filename} by 180 degrees")

# Specify the folder containing the images
image_folder = 'datatest/temp'

# Rotate all images in the specified folder
rotate_images_in_folder(image_folder)

