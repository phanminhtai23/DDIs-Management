"""
Copyright (c) 2019-present NAVER Corp.
MIT License
"""

# -*- coding: utf-8 -*-
from collections import OrderedDict
import sys
import os
import time
import argparse

import torch
import torch.nn as nn
import torch.backends.cudnn as cudnn
from torch.autograd import Variable

from PIL import Image

# Add the CRAFT directory to the Python path
current_directory = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.abspath(current_directory))

import cv2
import numpy as np
import craft_utils
import imgproc
import file_utils
import json
import zipfile

from craft import CRAFT


class Craft_Model:
    def __init__(self, model_path):
        self.model_path = model_path
        self.model = None
        
        # self.test_folder = 'images'
        # self.img_save_folder = 'images'
        # self.refiner_model = 'weights/craft_refiner_CTW1500.pth'
        # self.is_save_mask = True
        # self.is_save_boxes = True
        # self.show_time_process = True
        self.text_threshold = 0.7
        self.low_text = 0.4
        self.link_threshold = 0.4
        self.use_cuda = False
        self.canvas_size = 1280
        self.mag_ratio = 1.5
        self.poly = False
        self.show_time = False
        self.refine = False
        self.result_folder = './func/CRAFT/result_img/'

    def load_model(self):
        if self.model is None:
            self.model = CRAFT()
            if self.use_cuda:
                self.model.load_state_dict(self.copyStateDict(
                    torch.load(self.model_path)))
                self.model = self.model.cuda()
                self.model = torch.nn.DataParallel(self.model)
                cudnn.benchmark = False
            else:
                self.model.load_state_dict(self.copyStateDict(
                    torch.load(self.model_path, map_location='cpu')))
        return self.model
    
    
# sys.stdout.reconfigure(encoding='utf-8')


    def copyStateDict(self, state_dict):
        if list(state_dict.keys())[0].startswith("module"):
            start_idx = 1
        else:
            start_idx = 0
        new_state_dict = OrderedDict()
        for k, v in state_dict.items():
            name = ".".join(k.split(".")[start_idx:])
            new_state_dict[name] = v
        return new_state_dict


    def str2bool(self, v):
        return v.lower() in ("yes", "y", "true", "t", "1")


    def test_net(self, net, image, text_threshold, link_threshold, low_text, cuda, poly, refine_net=None):
        t0 = time.time()

        # resize
        img_resized, target_ratio, size_heatmap = imgproc.resize_aspect_ratio(
            image, self.canvas_size, interpolation=cv2.INTER_LINEAR, mag_ratio=self.mag_ratio)
        ratio_h = ratio_w = 1 / target_ratio

        # preprocessing
        x = imgproc.normalizeMeanVariance(img_resized)
        x = torch.from_numpy(x).permute(2, 0, 1)    # [h, w, c] to [c, h, w]
        x = Variable(x.unsqueeze(0))                # [c, h, w] to [b, c, h, w]
        if cuda:
            x = x.cuda()

        # forward pass
        with torch.no_grad():
            y, feature = net(x)

        # make score and link map
        score_text = y[0, :, :, 0].cpu().data.numpy()
        score_link = y[0, :, :, 1].cpu().data.numpy()

        # refine link
        if refine_net is not None:
            with torch.no_grad():
                y_refiner = refine_net(y, feature)
            score_link = y_refiner[0, :, :, 0].cpu().data.numpy()

        t0 = time.time() - t0
        t1 = time.time()

        # Post-processing
        boxes, polys = craft_utils.getDetBoxes(
            score_text, score_link, text_threshold, link_threshold, low_text, poly)

        # coordinate adjustment
        boxes = craft_utils.adjustResultCoordinates(boxes, ratio_w, ratio_h)
        polys = craft_utils.adjustResultCoordinates(polys, ratio_w, ratio_h)
        for k in range(len(polys)):
            if polys[k] is None:
                polys[k] = boxes[k]

        t1 = time.time() - t1

        # render results (optional)
        render_img = score_text.copy()
        render_img = np.hstack((render_img, score_link))
        ret_score_text = imgproc.cvt2HeatmapImg(render_img)

        if self.show_time:
            print("\ninfer/postproc time : {:.3f}/{:.3f}".format(t0, t1))

        return boxes, polys, ret_score_text


    def find_longest_ratio_box(self, bboxes):
        max_ratio = 0
        longest_ratio_box = None

        for box in bboxes:
            # Tính chiều dài và chiều rộng của hộp
            width = np.linalg.norm(box[0] - box[3])
            height = np.linalg.norm(box[0] - box[1])

            # Tính tỷ lệ dài
            ratio = max(width, height) / min(width, height)

            # Kiểm tra nếu tỷ lệ này là lớn nhất
            if ratio > max_ratio:
                max_ratio = ratio
                longest_ratio_box = box

        return longest_ratio_box, max_ratio


    def get_horizontal_vector(self, image):
        h, w = image.shape[:2]
        # Tọa độ của hai điểm nằm trên trục ngang giữa bức ảnh
        point1 = np.array([0, h // 2])
        point2 = np.array([w, h // 2])
        # Tạo vector từ hai điểm này
        horizontal_vector = point2 - point1
        return horizontal_vector


    # Hàm tính góc xoay cần thiết

    def calculate_rotation_angle(self, box, img):
        # Tính vector của cạnh dài nhất
        edge1 = box[1] - box[0]
        edge2 = box[2] - box[1]
        if np.linalg.norm(edge1) > np.linalg.norm(edge2):
            longest_edge = edge1
        else:
            longest_edge = edge2

        # Tính góc giữa cạnh dài nhất và trục x
        angle = np.arctan2(longest_edge[1], longest_edge[0])
        # print("Góc giữa cạnh dài nhất và trục x:", np.degrees(angle))
        return np.degrees(angle)

    # Hàm xoay ảnh


    def rotate_image(self, image, angle):
        (h, w) = image.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(image, M, (w, h))
        return rotated


    def load_model_CRAFT(self, Craft_model_path):
        # load net
        net = CRAFT()
        t_load_cuda = time.time()
        # print('Loading weights from checkpoint (' + trained_model + ')')
        if self.use_cuda:
            net.load_state_dict(self.copyStateDict(torch.load(Craft_model_path)))
            # print("Load CAFT model sucessfully in {:3.f}".format(time.time() - t_load_cuda))
        else:
            net.load_state_dict(self.copyStateDict(
                torch.load(Craft_model_path, map_location='cpu')))
            # print("Load CAFT model sucessfully in {:3.f}".format(
            #     time.time() - t_load_cuda))

        if self.use_cuda:
            net = net.cuda()
            net = torch.nn.DataParallel(net)
            cudnn.benchmark = False
        return net


    def preview_img(self, name, image):
        cv2.namedWindow(name, cv2.WINDOW_NORMAL)
        cv2.resizeWindow(name, 500, 500)
        cv2.imshow(name, image)


    def draw_box_on_img(self, box, img):
        if box is not None:
            pts = box.reshape((-1, 1, 2)).astype(np.int32)
            cv2.polylines(img, [pts], isClosed=True,
                        color=(0, 255, 0), thickness=2)
        return img

    def rotate_image_equal_craft(self, pil_img, show_time=False, save_result=False, result_folder=None, is_save_mask=False, is_save_boxes = False, filename="result_img"):
        t0 = time.time()
        print("Running CRAFT model...")
        self.model.eval()
        # LinkRefiner
        refine_net = None
        poly = False
        if self.refine:
            from refinenet import RefineNet
            refine_net = RefineNet()
            # print('Loading weights of refiner from checkpoint (' + refiner_model + ')')
            if self.use_cuda:
                refine_net.load_state_dict(
                    self.copyStateDict(torch.load(self.refiner_model)))
                refine_net = refine_net.cuda()
                refine_net = torch.nn.DataParallel(refine_net)
            else:
                refine_net.load_state_dict(self.copyStateDict(
                    torch.load(self.refiner_model, map_location='cpu')))

            refine_net.eval()
            poly = True

        # print("Test image {:d}/{:d}: {:s}".format(k+1, len(image_list), image_path), end='\r')
        image = imgproc.loadImage(pil_img)

        
        bboxes, polys, score_text = self.test_net(
            self.model, image, self.text_threshold, self.link_threshold, self.low_text, self.use_cuda, poly, refine_net)
        # _________________________
        # print("box:", bboxes)
        # Lấy box có radio dài nhất
        longest_ratio_box, max_ratio = self.find_longest_ratio_box(bboxes)
        # print("Hộp có tỷ lệ dài nhất:", longest_ratio_box)
        # print("Tỷ lệ dài nhất:", max_ratio)

        # ảnh xoay
        # iamge_ne = cv2.imread(image_path)
        init_image = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        # init_image = pil_img
        # Tính góc xoay cần thiết
        angle = self.calculate_rotation_angle(longest_ratio_box, init_image)

        # # Vẽ box dài nhất và hiển thị ảnh
        # init_image = draw_box_on_img(longest_ratio_box, init_image)
        # preview_img("draw box Image", init_image)

        # Xoay ảnh
        rotated_image = self.rotate_image(init_image, angle)
        # _________________________

        # save score text
        if is_save_mask:
            # filename, file_ext = os.path.splitext(os.path.basename(image_path))
            mask_file = result_folder + "/res_" + filename + '_mask.jpg'
            cv2.imwrite(mask_file, score_text)
            print("Mask on img saved to", result_folder)

            # save boxes lên ảnh
        if is_save_boxes:
            file_utils.saveResult(
                filename, image[:, :, ::-1], polys, dirname=result_folder)
            print("Boxes on img saved to", result_folder)

        if show_time:
            t1 = time.time() - t0
            print("Craft done in: {:0.3f}".format(t1))
        
        rotated_pil_img = Image.fromarray(cv2.cvtColor(rotated_image, cv2.COLOR_BGR2RGB))
        if save_result:
            cv2.imwrite(result_folder + "result_img_with_craft.jpg", rotated_image)
            print("Đã lưu ảnh xử lý bằng CRAFT: ",
                  result_folder + "result_img_with_craft.jpg")
        
        return rotated_pil_img
