import json
import requests
from icecream import ic
# KEY API Gemini
import icecream as ic
import google.generativeai as genai
import re
import json
import base64
import re
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import httpx


history_general = [
    {
        "role": "user",
        "parts": """
        Dữ liệu sau là file thông tin của một loại thuốc, có thể chứa thông tin về tương tác thuốc giữa hoạt chất với hoạt chất, Tương tác thuốc là hiện tượng xảy ra khi dùng phối hợp hai hay nhiều thuốc mà có sự thay đổi tác dụng của một hoặc nhiều thuốc dùng phối hợp. Đó có thể là sự tăng hoặc giảm tác dụng điều trị hoặc xuất hiện những tác dụng không mong muốn của thuốc. Hãy trích xuất dữ liệu nếu có cặp tương tác thuốc giữa hoạt chất với hoạt chất thì tạo dữ liệu json như sau:
        {
            TenThuoc (Tên thuốc, chính xác chỉ 1 tên thuốc, tên chính xác)
            HoatChat_1 (Là hoạt chất của thuốc, chính xác chỉ 1 chất, tên chính xác, và nó có thông tin tương tác thuốc với hoatChat_2)
            HoatChat_2 (Là hoạt chất của thuốc, chính xác chỉ 1 chất, tên chính xác, và nó có thông tin tương tác thuốc với hoatChat_1)
            MucDoNghiemTrong (Mức độ nghiêm trọng chỉ lưu các giá trị: Nghiêm trọng, Trung bình, Nhẹ. Nếu không có thì lưu 'Không xác định')
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
# Đường dẫn file log của Điển
log_file = open(
    "H:/My Drive/HK2-Nam4/Nien-Luan-Nganh/TuongTacThuoc/extracting_v3_api/log3.txt", "w", encoding="utf-8")

# đường dẫn file log ghi file pdf lỗi
file_path_logs = "H:/My Drive/HK2-Nam4/Nien-Luan-Nganh/TuongTacThuoc/extracting_v3_api/extracted_pdfs_logs_v3.txt"

# Đường dẫn đến file json
json_file_path = "H:/My Drive/HK2-Nam4/Nien-Luan-Nganh/TuongTacThuoc/extracting_v3_api/Thuoc1_DDI_v3.json"

# Khởi tạo API
global GEMINI_API_KEY_STUDENT, GEMINI_API_KEY_MINHTAI, GEMINI_API_KEY_MINHTAIac1, GENERAL_API_KEY, GEMINI_MODEL


GEMINI_API_KEY_STUDENT = ""
GEMINI_API_KEY_MINHTAI = ""
GEMINI_API_KEY_MINHTAIac1 = ""

GENERAL_API_KEY = GEMINI_API_KEY_MINHTAIac1

genai.configure(api_key=GENERAL_API_KEY)
GEMINI_MODEL = genai.GenerativeModel("gemini-2.0-flash")


def swap_api_key():
    global GENERAL_API_KEY
    if GENERAL_API_KEY == GEMINI_API_KEY_STUDENT:
        GENERAL_API_KEY = GEMINI_API_KEY_MINHTAI
    else:
        GENERAL_API_KEY = GEMINI_API_KEY_STUDENT
    genai.configure(api_key=GENERAL_API_KEY)
    global GEMINI_MODEL
    GEMINI_MODEL = genai.GenerativeModel("gemini-2.0-flash")

# Hàm lấy tất cả các thuốc từ danh sách


def writting_error_logs(text="", e="", order=-9999):
    with open(file_path_logs, 'a', encoding='utf-8') as file:
        file.write(
            f"path: {text}\nOrder: {str(order)}\nError: {str(e)}\n_________________________________________________________________________________________________\n")


def pdf_url_to_json_data(pdf_url, filename):
    try:
        # Generate content using the cached prompt and document
        chat = GEMINI_MODEL.start_chat(
            history=history_general
        )
        doc_data = base64.standard_b64encode(
            httpx.get(pdf_url).content).decode("utf-8")

        response = chat.send_message(
            [{'mime_type': 'application/pdf', 'data': doc_data}, ""])

        return response.text
    except Exception as e:
        if str(e) == "429 Resource has been exhausted (e.g. check quota).":
            print("limited api key, swap to another key...")

            swap_api_key()
            print("SWAPPED API KEYYYYYYYYYYYYYY...")
            chat = GEMINI_MODEL.start_chat(
                history=history_general
            )
            doc_data = base64.standard_b64encode(
                httpx.get(pdf_url).content).decode("utf-8")
            response = chat.send_message(
                [{'mime_type': 'application/pdf', 'data': doc_data}, ""])
            return response.text
        elif str(e) == "400 The document has no pages.":
            print(f"Không tìm thấy file pdf: {filename} ❌❌")
            writting_error_logs(text=filename, e=e)
            return False
        else:

            writting_error_logs(text=filename, e=e)
            print(f"Lỗi Gemini trích file pdf: {filename} ❌❌❌❌❌❌❌❌", e)
            return False


def save_json_data(json_data, json_file_path):
    with open(json_file_path, 'r+', encoding='utf-8') as file:
        data = json.load(file)
        if isinstance(data, list):
            data.append(json_data)
        file.seek(0)
        json.dump(data, file, ensure_ascii=False, indent=4)


# Đọc dữ liệu hiện tại từ tệp JSON
try:
    with open(json_file_path, 'r', encoding='utf-8') as file:
        file_content = file.read().strip()
        if file_content:
            drugs_data = json.loads(file_content)
        else:
            drugs_data = []
except FileNotFoundError:
    drugs_data = []

drugs_name = []


# 0 -> 511, Tài 0 -> 255, Điển 256 -> 511

# số thuốc đã cào, ghi lại chỉ số gần nhất
count_pdf_had_DDI = 3593
# index trang, ghi lại chỉ số gần nhất + 1
start_index_page = 256
# Số thuốc có pdf nhưng Gemini k tìm thấy DDIs, ghi lại chỉ số gần nhất
count_pdf_no_DDI = 1505

for page in range(start_index_page, 256, 1):

    response = requests.get(
        f'https://drugbank.vn/services/drugbank/api/public/thuoc?page={page}&size=20&isHide=ne(Yes)&sort=tenThuoc,asc&sort=tenThuoc')
    if response.status_code == 200:
        # &sort = tenThuoc, asc
        drugs = response.json()

        # Duyệt qua từng loại thuốc trong mảng thuốc
        for drug in drugs:

            count_same_name = 0

            initial_drug_name = drug['tenThuoc'].strip()
            split_name = initial_drug_name.split(" ")
            global drug_name
            drug_name = ""

            # Xử lý tên thuốc
            for i in range(len(split_name)):
                drug_name += split_name[i] + "_"

            drug_name = drug_name.rstrip("_")

            file_name = drug['meta']['fileName']

            while drug_name in drugs_name:
                count_same_name += 1
                drug_name = drug_name + "_" + str(count_same_name)

            # print(drug_name)
            pdf_url = "https://cdn.drugbank.vn/" + file_name

            response = pdf_url_to_json_data(pdf_url, drug_name)

            # print("response: ", response)
            if response is not False:
                match = re.search(r'```json\n(.*?)\n```',
                                  response, re.DOTALL)
                if match:
                    json_string = match.group(1)
                    # print("json_string: ", json_string)
                    global json_array
                    try:
                        json_array = json.loads(json_string)
                        # writting_error_logs(json_string, e)
                    except Exception as e:
                        count_pdf_no_DDI += 1
                        writting_error_logs(drug_name, e, count_pdf_no_DDI)
                        print(
                            f"{drug_name}: ❌ Không tìm thấy cặp tương tác thuốc - {count_pdf_no_DDI}")
                        continue
                    save_json_data(json_array, json_file_path)
                    # print(json_object)
                    # global count_pdf_had_DDI
                    count_pdf_had_DDI += 1
                    print(
                        f"{drug_name} - {count_pdf_had_DDI}: ✔")
                else:
                    count_pdf_no_DDI += 1
                    writting_error_logs(text=drug_name, order=count_pdf_no_DDI)
                    print(
                        f"{drug_name}: ❌ Không tìm thấy cặp tương tác thuốc - {count_pdf_no_DDI}")
                drugs_name.append(drug_name)

    print(f"Đã cào xong chỉ số trang: {page}*****************")
