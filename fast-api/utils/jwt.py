from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS
from database import tokens_collection
from bson import ObjectId


# Tạo JWT
def create_access_token(data: dict):
    to_encode = data.copy()
    created_at = datetime.now(timezone.utc)
    expires_at = created_at + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expires_at})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt, created_at, expires_at

# Xác minh JWT
async def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # Kiểm tra hạn token
        if payload["exp"] < datetime.now(timezone.utc).timestamp():
            return None  # Token hết hạn

        # print("voday neee")

        token_data = await tokens_collection.find_one({"token": token})
        is_revoked = token_data and token_data.get("is_revoked", False)
        
        if is_revoked:
            return None  # Token đã bị thu hồi

        return payload  # Token hợp lệ, trả về payload chứa thông tin user
    except JWTError:
        return None  # Token không hợp lệ
    
    
def create_refresh_token(user_id: str, device_info: str):
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    refresh_token = jwt.encode(
        {"sub": user_id, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

    # Lưu vào MongoDB
    tokens_collection.insert_one({
        "user_id": ObjectId(user_id),
        "token": refresh_token,
        "expires_at": expire,
        "created_at": datetime.now(timezone.utc),
        "device_info": device_info,
        "is_revoked": False
    })

    return refresh_token
