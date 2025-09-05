import tensorflow as tf
import numpy as np
import cv2
import os
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import time
from PIL import Image
import numpy as np

# import tensorflow
# print(tensorflow.__version__)
class CNN_Model:
    def __init__(self, model_path):
        self.model_path = model_path
        self.model = None

    def load_model(self):
        if self.model is None:
            self.model = load_model(self.model_path)
        return self.model

    def image_flip_prediction(self, pil_img, show_time=False, save_result=False, result_folder=None):
        t0 = time.time()
        print("Running CNN model...")
        # Load và tiền xử lý ảnh
        img = pil_img.resize((224, 224))
        img = img.convert('RGB')
        # img = pil_img
        # img = image.load_img(img_path, target_size=(224, 224))
        # img_array = np.array(img)
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)  # Thêm batch dimension
        img_array /= 255.0  # Chuẩn hóa dữ liệu

        # Dự đoán
        prediction = self.model.predict(img_array)
        orientation = "0°" if prediction[0][0] < 0.5 else "180°"

        # print(f"Dự đoán hướng: {orientation}")

        # Nếu ảnh được dự đoán là 180°, xoay lại và lưu
        if orientation == "180°":
            image_cv = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
            # img_cv = cv2.imread(img_path)
            if image_cv is not None:
                img_rotated = cv2.rotate(image_cv, cv2.ROTATE_180)  # Xoay 180 độ
                # print(f"Ảnh đã xoay")
                t1 = time.time() - t0
                
                if show_time:
                    print("Done in: {:.2f}".format(t1))
                # pil_image = Image.fromarray(
                #     img_rotated)
                
                
                orientated_pil_image = Image.fromarray(
                    cv2.cvtColor(img_rotated, cv2.COLOR_BGR2RGB))
                if save_result:
                    orientated_pil_image.save(result_folder + 'CNN_latAnh.jpg')
                    print("Đã lưu ảnh xử lý bằng CNN: ", result_folder + 'CNN_latAnh.jpg')
                return orientated_pil_image
                # return img_rotated
            else:
                if show_time:
                    print("Done in: {:.2f}".format(t1))
                # print(f"Không thể đọc ảnh")
        else:
            return pil_img
        
        
# # Hàm chính để thực thi
# def main():
#     model = load_trained_model("./func/Rotate_img_model/orientation_model.h5")
#     # Thay bằng đường dẫn ảnh của bạn
#     test_image_path = r"C:\\Users\\MINH TAI\Desktop\\page_1.jpeg"
#     result_dir = "./func/Rotate_img_model/result"
#     os.makedirs(result_dir, exist_ok=True)  # Tạo thư mục nếu chưa có

#     pil_img = Image.open(test_image_path)
#     pil_img.show()
#     img_rotated = predict_and_correct_orientation(model, pil_img)
#     output_path = os.path.join(result_dir, os.path.basename(test_image_path))  # Đường dẫn lưu ảnh
#     img_rotated.save(output_path)
#     print(f"Ảnh đã được lưu tại: {output_path}")

# if __name__ == "__main__":
#     main()