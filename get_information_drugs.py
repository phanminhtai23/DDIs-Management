import json
import requests
from icecream import ic

json_data_path = "../Data/drugs.json"

# Đọc dữ liệu hiện tại từ tệp JSON
try:
    with open(json_data_path, 'r', encoding='utf-8') as file:
        file_content = file.read().strip()
        if file_content:
            drugs_data = json.loads(file_content)
        else:
            drugs_data = []
except FileNotFoundError:
    drugs_data = []

# Lấy dữ liệu từ API và thêm vào danh sách
for page in range(513):

    response = requests.get(
        f'https://drugbank.vn/services/drugbank/api/public/thuoc?page={page}&size=20&isHide=ne(Yes)&sort=soDangKy,asc&sort=id')
    if response.status_code == 200:
        data = response.json()

        # Duyệt qua từng loại thuốc trong mảng thuốc
        for drug in data:
            drugs_data.append(drug)
    ic("Đã cào xong trang: ", page)

ic("Đã cào xong !")
ic("Tổng số thuốc: ", len(drugs_data))

# Ghi lại dữ liệu đã cập nhật vào tệp JSON
with open(json_data_path, 'w', encoding='utf-8') as file:
    json.dump(drugs_data, file, ensure_ascii=False, indent=4)
