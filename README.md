# 💊 Hệ Thống Quản Lý & Tra Cứu Tương Tác Thuốc

Niên luận ngành Khoa học Máy tính  
**Sinh viên thực hiện:** Phan Minh Tài  
**GVHD:** TS. Lưu Tiến Đạo

---

## 🧠 Giới thiệu

Hệ thống giúp người dùng:
- ✅ Tra cứu thông tin thuốc và tương tác giữa các loại thuốc
- ✅ Quản lý thông tin thuốc & cặp tương tác (Admin)
- ✅ Trích xuất thông tin thuốc tự động từ ảnh/PDF dùng AI (YOLOv11, CRAFT, Gemini)

Công nghệ sử dụng:
- Frontend: `React`, `Tailwind CSS`
- Backend: `FastAPI`, `MongoDB`
- AI: `YOLOv11s-Seg`, `CRAFT`, `Gemini API`

---

## 📦 Import dữ liệu MongoDB (tuỳ chọn)
Dữ liệu mẫu đã export trong thư mục data/, dùng lệnh sau để import:
``` bash
mongoimport --uri "your mongodb uri" --db your_database_name --collection drugs --file data/drugs.json --jsonArray
mongoimport --uri "your mongodb uri" --db your_database_name --collection drug_interaction --file data/drug-interaction.json --jsonArray
mongoimport --uri "your mongodb uri" --db your_database_name --collection users --file data/users.json --jsonArray
mongoimport --uri "your mongodb uri" --db your_database_name --collection tokens --file data/tokens.json --jsonArray
```
---
## Tải dự án
```bash
git clone https://github.com/phanminhtai23/DDIs-Management
cd DDIs-Management
```

## 🛠️ Cài đặt Backend (FastAPI)

### 1. Cài đặt
```bash
cd fast-api
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```
### 2. Tạo file .env
Tạo file .env trong thư mục fast-api/, nội dung tham khảo từ .env.example:
``` bash
MONGO_URI="your mongodb uri"
DATABASE_NAME="your database name"

HOST=127.0.0.1
PORT=8015
DEBUG=True

SECRET_KEY="your secret key" # 32 characters
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7

GEMINI_API_KEY="your gemini api, get on https://aistudio.google.com/apikey"
```
### 3. Khởi chạy server
``` bash
Sao chép mã
uvicorn app.main:app --reload
API chạy tại http://127.0.0.1:8015
```
---
## 💻 Cài đặt Frontend (React)
### 1. Cài đặt
``` bash
cd my-react-app
npm install
```
### 2. Tạo file .env
Tạo file .env trong thư mục my-react-app/, nội dung tham khảo từ .env.example:
``` bash
HOST=127.0.0.1
PORT=3002
REACT_APP_BASE_BACKEND_URL=http://127.0.0.1:8015

REACT_APP_CLOUD_NAME="your cloudinary key"
REACT_APP_UPLOAD_PRESET="your folder name in cloudinary"
```
### 3. Khởi chạy
``` bash
npm run dev
```
---
## 🔐 Tài khoản mẫu
Mở Browser bất kỳ vào link **127.0.0.1:3002/admin/auth/login** để đăng nhập vào hệ thống.
- Email: phanminhtai23@gmail.com
- Mật khẩu: admin123
- Quyền: Admin
---
## 📌 Ghi chú

- ⚠️ **Đảm bảo MongoDB đang hoạt động** trước khi chạy backend.
- 🌥️ **Cần tạo tài khoản [Cloudinary](https://cloudinary.com/)** để sử dụng tính năng upload ảnh (nếu có).
- 🔑 **Dự án sử dụng [Gemini API](https://aistudio.google.com/apikey)** từ Google để trích xuất dữ liệu từ ảnh và PDF. Bạn cần tạo API Key tại trang Aistudio.
---

