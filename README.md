# Hệ Thống Quản Lý & Tra Cứu Tương Tác Thuốc 🔍💊

## ✨ Tính năng nổi bật

Hệ thống giúp người dùng:
- ✅ Tra cứu thông tin thuốc và tương tác giữa các loại thuốc
- ✅ Quản lý thông tin của hơn 9.000 loại thuốc & hơn 21.000 cặp tương tác (Admin)
- ✅ Trích xuất thông tin thuốc tự động từ ảnh/PDF dùng AI (YOLOv11, CRAFT, Gemini)

## Công nghệ sử dụng:
### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Backend
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

### AI
![YOLOv11](https://img.shields.io/badge/YOLOv11-47A248?style=for-the-badge&logo=tensorflow&logoColor=white)
![CRAFT](https://img.shields.io/badge/CRAFT-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white)


## **Khởi chạy nhanh với Docker** 🚀🐳
### Yêu cầu hệ thống
- Docker & Docker Compose
- Port 3002, 8015, 27018 trống
### 1. Tải dự án
```bash
# Tải dự án
git clone https://github.com/phanminhtai23/DDIs-Management.git
cd ./DDIs-Management
```
### 2. Khởi tạo biến môi trường
Tạo file .env giống .env.example tại /fast-api/.env và /react-ui/.env rồi điền các trường còn thiếu.
#### **Nội dung /fast-api/.env**
```bash
MONGO_URI=mongodb://mongodb:27017  # giữ nguyên
DATABASE_NAME=ddis_management # giữ nguyên
HOST=127.0.0.1
PORT=8015
DEBUG=True
SECRET_KEY="Bạn cần điền" # khóa mật 32 ký tự bất kỳ
ALGORITHM="HS256" # giải thuật băm ví dụ HS256, RS256, ...
ACCESS_TOKEN_EXPIRE_MINUTES=60 # thời gian hết hạn token
REFRESH_TOKEN_EXPIRE_DAYS=7 # thời gian hết hạn refresh token
GEMINI_API_KEY="Bạn cần điền" # gemini api key lấy từ https://aistudio.google.com/apikey
```

#### **Nội dung /react-ui/.env**
```bash
HOST=0.0.0.0
PORT=3002
REACT_APP_BASE_BACKEND_URL=http://localhost:8015 # Giữ nguyên
REACT_APP_CLOUD_NAME=dwdplk5xq # Giữ nguyên hoặc Có thể lấy cloud name của bạn, lấy từ https://cloudinary.com/
REACT_APP_UPLOAD_PRESET=drug_drug_interaction # Giữ nguyên hoặc Có thể lấy cloud của bạn, lấy từ https://cloudinary.com/
```
### 3. Khởi chạy các Services (FE, BE, DB)
- 3.1 Khởi chạy dự án bằng cách sử dụng docker images đã được build sẵn, sử dụng cách này khi chỉ muốn chạy nhanh dự án.
- 3.2 Khởi dụng dự án bằng cách build lại từ đầu, sử dụng cách này khi bạn có sửa đổi mã nguồn, cách này sẽ tốn nhiều thời gian chạy.

**Lưu ý: chỉ dùng một trong hai bước 3.1 hoặc 3.2, không chạy cả hai để tránh tràn bộ nhớ.**

#### 3.1. Chạy nhanh dự án
```bash
cd ./DDIs-Management
docker-compose -f docker-compose-quickstart.yml up -d
```
#### 3.2. Build lại dự án
```bash
cd ./DDIs-Management
docker-compose -f docker-compose-setup.yml up -d --build
```
### 4. Đợi các Services khởi động xong rồi import dữ liệu
Import dữ liệu hệ thống từ thư mục /data vào MongoDB
```bash
Get-ChildItem .\data\*.json | ForEach-Object {
    $collectionName = $_.BaseName
    Write-Host "Importing $collectionName..." -ForegroundColor Cyan
    
    docker exec ddis-mongodb mongoimport `
        --db ddis_management `
        --collection $collectionName `
        --file "/data/import/$($_.Name)" `
        --jsonArray `
        --drop
}
```
### 5. Truy cập ứng dụng

### 🔗 Liên kết truy cập
- **Mở Browser bất kỳ truy cập:** http://localhost:3002/admin/auth/login để sử dụng

- **Docs Backend API**: http://localhost:8015/docs
- **URI MongoDB**: localhost:27018

### 👤 Tài khoản để truy cập
- **Username**: `phanminhtai23@gmail.com`
- **Password**: `admin123`

## 🛑 Dừng services
### Sử dụng cho bước 3.1:
```bash
docker-compose -f docker-compose-quickstart.yml down
```
### Sử dụng cho bước 3.2:
```bash
docker-compose -f docker-compose-setup.yml down
```
---
## **Khởi chạy dự án thủ công** 🛠️
### 1. 📦 Import dữ liệu MongoDB (tuỳ chọn)
Dữ liệu mẫu đã export trong thư mục data/, dùng lệnh sau để import:
``` bash
mongoimport --uri "your mongodb uri" --db your_database_name --collection drugs --file data/drugs.json --jsonArray
mongoimport --uri "your mongodb uri" --db your_database_name --collection drug_interaction --file data/drug-interaction.json --jsonArray
mongoimport --uri "your mongodb uri" --db your_database_name --collection users --file data/users.json --jsonArray
mongoimport --uri "your mongodb uri" --db your_database_name --collection tokens --file data/tokens.json --jsonArray
```
---
## 2. Tải dự án
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
Sao chép mã
``` bash
uvicorn app.main:app --reload
# API chạy tại http://127.0.0.1:8015
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

## LICENSE [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)  
Mã nguồn tuân theo giấy phép MIT, chi tiết đọc file LICENSE
