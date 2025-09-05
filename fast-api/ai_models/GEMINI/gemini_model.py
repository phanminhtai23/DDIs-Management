import json
import google.generativeai as genai
import re
import json
import base64
import re
import httpx
from fastapi import HTTPException

from config import GEMINI_API_KEY


class Gemini_Model:
    
    def __init__(self, version_model="gemini-2.0-flash"):
        self.prompt_get_drug_infor = [
            {
                "role": "user",
                "parts": """
        Dữ liệu sau là các files chứa thông tin của một loại thuốc, có thể chứa thông tin về thuốc, tôi muốn bạn chỉ trả về thông của thuốc về: 
        id (là số đăng ký thuốc, nếu không tìm thấy thì để rỗng)
        tenThuoc (là tên của thuốc, ghi chính xác, nếu không không trả về gì cả)
        dotPheDuyet (là đợt phê duyệt của thuốc, nếu không tìm thấy thì để rỗng)
        soQuyetDinh (là số quyết định của thuốc, nếu không tìm thấy thì để rỗng)
        pheDuyet (là ngày phê duyệt của thuốc, nếu không tìm thấy thì để rỗng)
        hieuLuc (là ngày hiệu lực của thuốc, nếu không tìm thấy thì để rỗng)
        soDangKy (là số đăng ký của thuốc, nếu không tìm thấy thì để rỗng)
        hoatChat (là một mảng chứa các object gồm tenHoatChat và nongDo (tôi sẽ định nghĩa sau)
        tenHoatChat (là tên của hoạt chất, nếu không tìm thấy thì để rỗng)
        nongDo (là nồng độ của hoạt chất tương ứng, nếu không tìm thấy thì để rỗng)
        phanLoai (là phân loại của thuốc, nếu không tìm thấy thì để rỗng)
        taDuoc (là thông tin về tả dược của thuốc, nếu không tìm thấy thì để rỗng)
        baoChe (là thông tin về bào chế của thuốc, nếu không tìm thấy thì để rỗng)
        dongGoi (là thông tin về đóng gói của thuốc, nếu không tìm thấy thì để rỗng)
        tieuChuan (là tiêu chuẩn của thuốc, nếu không tìm thấy thì để rỗng)
        tuoiTho (là tuổi thọ của thuốc, nếu không tìm thấy thì để rỗng)
        congTySx (là công ty sản xuất của thuốc, nếu không tìm thấy thì để rỗng)
        congTySxCode (là mã công ty sản xuất của thuốc, nếu không tìm thấy thì để rỗng)
        nuocSx (là nước sản xuất của thuốc, nếu không tìm thấy thì để rỗng)
        diaChiSx (là địa chỉ sản xuất của thuốc, nếu không tìm thấy thì để rỗng)
        congTyDk (là công ty đăng ký của thuốc, nếu không tìm thấy thì để rỗng)
        nuocDk (là nước đăng ký của thuốc, nếu không tìm thấy thì để rỗng)
        diaChiDk (là địa chỉ đăng ký của thuốc, nếu không tìm thấy thì để rỗng)
        nhomThuoc (là nhóm thuốc của thuốc, nếu không tìm thấy thì để rỗng)
        Hãy chỉ trả về một json với các thông tin trên, nếu không tìm thấy thông tin nào thì không trả về gì cả, sau đây là một ví dụ mẫu của một dữ liệu trả về:
        
        [
            {
                "id": "QLĐB-382-13",
                "tenThuoc": "Trenstad",
                "dotPheDuyet": "140",
                "soQuyetDinh": "162/QÐ-QLD",
                "pheDuyet": "19/06/2013",
                "hieuLuc": null,
                "soDangKy": "QLĐB-382-13",
                "hoatChat": [
                    {
                        "tenHoatChat": "emtricitabin",
                        "nongDo": "200 mg"
                    },
                    {
                        "tenHoatChat": "tenofovir disoproxil fumarat",
                        "nongDo": "300mg"
                    }
                ],
                "phanLoai": "Thuốc kê đơn",
                "taDuoc": "Tinh bột tiền hồ hóa, lactose monohydrat, microcrystallin cellulose, croscarmellose natri, magnesi stearat, Opadry xanh",
                "baoChe": "Viên nén bao phim",
                "dongGoi": "Hộp 3 vỉ x 10 viên; hộp 1 chai x 60 viên",
                "tieuChuan": "NSX",
                "tuoiTho": "24 tháng",
                "congTySx": "Công ty TNHH LD Stada-Việt Nam",
                "congTySxCode": "STELLAPHARM",
                "nuocSx": "Việt Nam",
                "diaChiSx": "Số 40 Đại lộ Tự Do, KCN Việt Nam - Singapore, Thuận An, Bình Dương",
                "congTyDk": "Công ty TNHH LD Stada-Việt Nam",
                "nuocDk": "Việt Nam",
                "diaChiDk": "Số 40 Đại lộ Tự Do, KCN Việt Nam - Singapore, Thuận An, Bình Dương",
                "nhomThuoc": "Tân dược"
            }
        ]
        
        Hãy chỉ trả về mảng về mảng dữ liệu trên trong cặp [].

        ** Quan trọng **: Các thông tin phải có như tên thuốc và hoạt chất, nếu không tìm thấy thì không trả về gì cả. Nếu có tìm thấy thì trả về dữ liệu trong cặp '[]' json và phải có đầy đủ các trường ở trên, trường nào không có thì để rỗng**
        
        """
            },
            {
                "role": "model",
                "parts": "ok, tôi sẽ vâng lời !"
            }
        ]
        self.prompt_get_DDIs = [
            {
                "role": "user",
                "parts": """
        Dữ liệu sau là các file thông tin của một loại thuốc, có thể chứa thông tin về tương tác thuốc giữa hoạt chất với hoạt chất, Tương tác thuốc là hiện tượng xảy ra khi dùng phối hợp hai hay nhiều thuốc mà có sự thay đổi tác dụng của một hoặc nhiều thuốc dùng phối hợp. Đó có thể là sự tăng hoặc giảm tác dụng điều trị hoặc xuất hiện những tác dụng không mong muốn của thuốc. Hãy trích xuất dữ liệu nếu có cặp tương tác thuốc giữa hoạt chất với hoạt chất thì tạo dữ liệu json như sau:
        {
            TenThuoc (Tên thuốc, chính xác chỉ 1 tên thuốc, tên chính xác)
            HoatChat_1 (Là hoạt chất của thuốc, chính xác chỉ 1 chất, tên chính xác, và nó có thông tin tương tác thuốc với oatChat_2)
            HoatChat_2 (Là hoạt chất của thuốc, chính xác chỉ 1 chất, tên chính xác, và nó có thông tin tương tác thuốc với oatChat_1)
            MucDoNghiemTrong (Mức độ nghiêm trọng chỉ lưu các giá trị: Nghiêm trọng, Trung bình, Nhẹ, Không xác định)
            CanhBaoTuongTacThuoc (Cảnh báo tương tác thuốc chi tiết đầy đủ, nếu không có bạn có thể sử dụng kiến thức chính xác của ban được xác thực của bạn để điền vào, nội dung đảm bảo đầy đủ các thông tin cần thiết về tương tác thuốc đó)
        }
        Hãy chỉ trả về mảng về mảng dữ liệu trên trong cặp [] bên trong là các cặp thuốc tương tác trong \{\} thôi nhé, Nếu trong cặp hoạt chất không xác định tên của 2 hoạt chất thì bỏ qua cặp tương tác thuốc đó, các thông tin phải có đầy đủ mới lưu vào cở dữ liệu.

        ** Quan trọng **: Các thông tin phải có đầy đủ tên thuốc, có cặp hoạt chất tương tác thì mới trả về mảng '[]' json. Nếu thiếu dữ liệu về tên thuốc hoặc không có cặp hoạt chất tương tác thuốc nào thì không trả về gì cả, Sau đây là file pdf:
        """
            },
            {
                "role": "model",
                "parts": "ok, tôi sẽ vâng lời !"
            }
        ]
        self.model = None
        self.version_model = version_model
        
    def load_model(self):
        try:
            genai.configure(api_key=GEMINI_API_KEY)
            self.model = genai.GenerativeModel(self.version_model)
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Failed to initialize Gemini model {e}"
            )

    def pdf_to_DDIs(self, pdf_url):
        print("Calling Gemini API...")
        try:
            # Generate content using the cached prompt and document
            chat = self.model.start_chat(history=self.prompt_get_DDIs)
            doc_data = base64.standard_b64encode(
                httpx.get(pdf_url).content
            ).decode("utf-8")

            response = chat.send_message(
                [{"mime_type": "application/pdf", "data": doc_data}, ""]
            )
            print("RESULT: ", response.text)
            match = re.search(r"```json\n(.*?)\n```", response.text, re.DOTALL)
            # If data is returned
            if match:
                json_string = match.group(1)
                json_array = json.loads(json_string)
                return json_array
            else:
                return None
        except Exception as e:
            print("Error extracting data with Gemini: ", e)
            raise HTTPException(
                status_code=400, detail=f"Error extracting data with Gemini {e}"
            )

    def images_to_DDIs(self, imgs_arr):
        print("Calling Gemini API...")
        try:
            # Generate content using the cached prompt and document
            chat = self.model.start_chat(history=self.prompt_get_DDIs)
            response = chat.send_message(
                [img for img in imgs_arr])

            print("RESULT: ", response.text)

            match = re.search(r"```json\n(.*?)\n```", response.text, re.DOTALL)
            # If data is returned
            if match:
                json_string = match.group(1)
                json_array = json.loads(json_string)
                return json_array
            else:
                return None
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error extracting data with Gemini {e}"
            )


    def pdf_to_drug_infor(self, pdf_url):
        print("Calling Gemini API...")
        try:
            # Generate content using the cached prompt and document
            chat = self.model.start_chat(history=self.prompt_get_drug_infor)
            doc_data = base64.standard_b64encode(
                httpx.get(pdf_url).content
            ).decode("utf-8")

            response = chat.send_message(
                [{"mime_type": "application/pdf", "data": doc_data}, ""]
            )
            print("RESULT: ", response.text)
            match = re.search(r"```json\n(.*?)\n```", response.text, re.DOTALL)
            # If data is returned
            if match:
                json_string = match.group(1)
                json_array = json.loads(json_string)
                return json_array
            else:
                return None
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error extracting data with Gemini: {e}"
            )

    def images_to_drug_infor(self, imgs_arr):
        print("Calling Gemini API...")
        try:
            # Generate content using the cached prompt and document
            chat = self.model.start_chat(
                history=self.prompt_get_drug_infor)
            response = chat.send_message(
                [img for img in imgs_arr])

            print("Result: \n", response.text)

            match = re.search(r"```json\n(.*?)\n```", response.text, re.DOTALL)
            # If data is returned
            if match:
                json_string = match.group(1)
                json_array = json.loads(json_string)
                return json_array
            else:
                return None
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error extracting data with Gemini 1: {e}"
            )
