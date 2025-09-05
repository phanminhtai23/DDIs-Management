from ultralytics import YOLO
from PIL import Image
import requests
import supervision as sv
import cv2
import numpy as np
import os
import time


current_directory = os.path.dirname(os.path.abspath(__file__))


#config
is_save_result = True
show_time = True

# model_path = current_directory + '/weights/last.pt'
# result_folder = current_directory + '/results_img/'

# # result_folder = './ultils/CRAFT/result_img/'
# if not os.path.isdir(result_folder):
#     os.mkdir(result_folder)

class Yolov11_Model:
    def __init__(self, model_path):
        self.model_path = model_path
        self.model = None

    def load_model(self):
        if self.model is None:
            self.model = YOLO(self.model_path)
        return self.model



    # Tô màu tài liệu nhận diện được
    def preview_annotated_image(self, image, result):
        detections = sv.Detections.from_ultralytics(result)

        mask_annotator = sv.MaskAnnotator()
        label_annotator = sv.LabelAnnotator(
            text_color=sv.Color.BLACK, text_position=sv.Position.CENTER)

        annotated_image = image.copy()
        annotated_image = mask_annotator.annotate(
            annotated_image, detections=detections)
        annotated_image = label_annotator.annotate(
            annotated_image, detections=detections)

        return annotated_image


    # Tô màu backgournd tài liệu nhận diện được
    def annotate_backGrounnd_document(self, image, result):
        # Lấy mask từ result.masks
        mask = result.masks.data[0].cpu().numpy().astype(
            np.uint8)  # Chọn mask cho đối tượng đầu tiên
        
        # Resize mask cho phù hợp với kích thước của ảnh gốc
        mask = cv2.resize(mask, (image.width, image.height))

        # Chuyển image sang NumPy array
        image_np = np.array(image)

        # Tạo một ảnh đen toàn bộ có cùng kích thước với image
        black_background = np.zeros_like(image_np)

        # Áp dụng mask: chỉ giữ lại vùng segmentation trên ảnh đen
        black_background[mask == 1] = image_np[mask == 1]
        
        return black_background


    def drop_image(self, black_background_img, result):
        for box in result.boxes.xyxy:
            x1, y1, x2, y2 = map(int, box)  # coordinates
            cropped_image = black_background_img[y1:y2, x1:x2]  # crop
            
            # Chuyển black_background từ NumPy array thành PIL Image
            cropped_image = Image.fromarray(cropped_image)
            return cropped_image

    # nhập model, ảnh -> trả về ảnh cắt theo tài liệu
    def detect_document_yolo11(self, pil_img, show_time=False, save_result=False, result_folder=None):
        print("Running YOLOv11 model...")
        to = time.time()

        # image = Image.open(image_path)
        result = self.model.predict(pil_img, conf=0.5)[0]
        annotated_image = self.annotate_backGrounnd_document(pil_img, result)
        droped_image = self.drop_image(annotated_image, result)
        
        t1 = time.time() - to
        if show_time:
            print("\nDone in: {:.3f}".format(t1))
            
        if save_result:
            droped_image.save(result_folder + 'output_yolov11.jpg')
            print("Saved result image to ", result_folder + 'input.jpg')
        
        return droped_image


# img_path = "H:/My Drive/HK2-Nam4/Nien-Luan-Nganh/TuongTacThuoc/func/Dien.jpg"
# pil_img = Image.open(img_path)

# model_path = "H:/My Drive/HK2-Nam4/Nien-Luan-Nganh/TuongTacThuoc/func/SEG_YOLOv11/weights/last.pt"

# model = load_model_yolo11(model_path)

# result = detect_document_yolo11(model, pil_img)

# result.show()
# print("Xác suất: ", result.boxes.conf)
# # print("Tọa độ box: ", result.boxes.xyxy)
