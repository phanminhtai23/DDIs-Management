from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserRegister(BaseModel):
    email: EmailStr
    full_name: str
    role: Optional[str] = "admin"  # Giá trị mặc định là "admin"
    password: str  # Nên hash mật khẩu trước khi lưu


class LoginRequest(BaseModel):
    email: EmailStr  # Đảm bảo email hợp lệ
    password: str
    device_info: Optional[str] = None


class UserResponse(BaseModel):
    email: EmailStr
    full_name: str
    role: Optional[str] = "admin"  # Giá trị mặc định là "admin"
    created_at: datetime


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None  # Có thể là "admin" hoặc "user"
