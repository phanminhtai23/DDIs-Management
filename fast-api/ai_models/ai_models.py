import time as Time

from ai_models.SEG_YOLOv11.detect_document_yolo11 import Yolov11_Model
from ai_models.CRAFT.rotated_img_craft import Craft_Model
from ai_models.CNN.Rotate_image import CNN_Model
from ai_models.GEMINI.gemini_model import Gemini_Model

result_folder = "./ai_models/Result_Images/"

class AI_Models:
    def __init__(self):
        self.Yolov11_Model = Yolov11_Model(
            model_path="./ai_models/SEG_YOLOv11/weights/best.pt",)
        
        self.Craft_Model = Craft_Model(
            model_path="./ai_models/CRAFT/craft_mlt_25k.pth")
        
        self.CNN_Model = CNN_Model(
            model_path="./ai_models/CNN/orientation_model.h5")
        
        self.Gemini_Model = Gemini_Model(
            version_model="gemini-2.0-flash")
        

    def load_models(self):
        try:
            to = Time.time()
            print("Loading models...")
            
            self.Yolov11_Model.load_model()
            self.Craft_Model.load_model()
            self.CNN_Model.load_model()
            self.Gemini_Model.load_model()
            
            print(f"Models loaded successfully in: {Time.time() - to:.2f}s")
        except Exception as e:
            print("Error loading models", str(e))
            raise
        

    def image_processing_stream(self, pil_img):
        # YOLO nhận diện tài liệu
        detected_document_img = self.Yolov11_Model.detect_document_yolo11(
            pil_img=pil_img, show_time=True, save_result=True, result_folder=result_folder)

        # Craft để xoay ảnh
        rotated_image = self.Craft_Model.rotate_image_equal_craft(
            pil_img=detected_document_img, show_time=True, save_result=True, result_folder=result_folder, is_save_mask=True, is_save_boxes=True, filename="result_img")

        # CNN để lật ảnh nếu ngược
        orientatied_img = self.CNN_Model.image_flip_prediction(
            pil_img=rotated_image, show_time=True, save_result=True, result_folder=result_folder)
        
        # print("Đã xử lý ảnh qua flows: Yolo -> Craft -> CNN")
        # self.preview_img(orientatied_img)
        
        return orientatied_img
    
    def get_DDIs_from_images(self, imgs_arr):
        return self.Gemini_Model.images_to_DDIs(imgs_arr=imgs_arr)
    
    def get_DDIs_from_pdf(self, pdf_url, show_time=True):
        to = Time.time()
        result = self.Gemini_Model.pdf_to_DDIs(pdf_url=pdf_url)
        if show_time:
            print(f"Time to get DDI from pdf: {Time.time() - to:.2f}s")
        return result
    
    
    def get_infor_drug_from_images(self, imgs_arr, show_time=True):
        to = Time.time()
        result = self.Gemini_Model.images_to_drug_infor(imgs_arr=imgs_arr)
        if show_time:
            print(f"Time to get DDI from img: {Time.time() - to}s")
        return result
    
    def get_infor_drug_from_pdf(self, pdf_url):
        return self.Gemini_Model.pdf_to_drug_infor(pdf_url=pdf_url)
    
    def preview_img(self, pil_image):
        pil_image.show()    
    
    
    