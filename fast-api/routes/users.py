from fastapi import APIRouter, HTTPException, Depends
from database import users_collection, tokens_collection
from schemas.user import UserRegister, LoginRequest, UserUpdate
from schemas.token import LogoutRequest
from utils.security import hash_password, verify_password, get_current_user
from utils.jwt import create_access_token
from fastapi.encoders import jsonable_encoder
# Assuming tokens_collection is defined in database


router = APIRouter()

@router.post("/register")
async def register(user: UserRegister):
    # Check if the email is already registered
    if await users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email đã được đăng ký")
    
    # Hash the user's password
    user_data = user.model_dump()
    user_data["email"] = user.email
    user_data["password"] = hash_password(user.password)
    user_data["full_name"] = user.full_name
    user_data["role"] = "admin"

    # print(user_data)
    
    # Insert the new user into the database
    result = await users_collection.insert_one(user_data)
    
    # Return the created user response
    return {
        "status_code": 200,
        "message": "Đăng ký tài khoản thành công",
        "user_id": str(result.inserted_id)
    }

@router.post("/login")
async def login(user: LoginRequest):
    db_user = await users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=404, detail="Email chưa đăng ký tài khoản")
    
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Sai tài khoản hoặc mật khẩu")
    
    # Đăng nhập thành công, tạo access token
    access_token, created_at, expires_at = create_access_token(
        data={"sub": db_user["email"]})
    # Save the token to the tokens collection
    token_data = {
        "username": db_user["email"],
        "token": access_token,
        "expires_at": expires_at,
        "created_at": created_at,
        "device_info": user.device_info,
        "is_revoked": False
    }
    await tokens_collection.insert_one(token_data)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "message": "Đăng nhập thành công",
        "full_name": db_user["full_name"],
    }


@router.get("/")
async def get_all_users(user: dict = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    users = await users_collection.find({"role": "user"}).to_list()
    valid_users = []
    for user in users:
        try:
            valid_users.append({
                "email": user["email"],
                "full_name": user["full_name"],
                "role": user["role"]
            })
        except KeyError as e:
            print(f"Missing key: {e}, skipping invalid user: {user}")

    return {"message": "Got users successfully", "users": valid_users}


@router.post("/logout")
async def logout(token: LogoutRequest, user: dict = Depends(get_current_user)):
    # Kiểm tra xem người dùng đã đăng nhập hay chưa
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    token_data = token.model_dump()
    token_data["token"] = str(token.token)
    # Đánh dấu token hiện tại là "đã thu hồi" (revoked)
    result = await tokens_collection.update_one(
        {"token": token_data["token"], "is_revoked": False},
        {"$set": {"is_revoked": True}}
    )

    # Kiểm tra xem token có tồn tại hay không
    if result.matched_count == 0:
        print("Token không tồn tại hoặc đã được thu hồi")
        raise HTTPException(
            status_code=404, detail="Token không tồn tại hoặc đã được thu hồi")

    return {"status": 200, "message": "Đăng xuất thành công"}


@router.get("/verify-token")
async def logout(user: dict = Depends(get_current_user)):
    # Kiểm tra xem người dùng đã đăng nhập hay chưa
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return {"status": 200, "message": "Token hợp lệ"}


@router.delete("/delete/{userEmail}")
async def delete_user(userEmail: str, user: dict = Depends(get_current_user)):
    # Kiểm tra xem người dùng đã đăng nhập hay chưa
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Xóa user từ database
    result = await users_collection.delete_one({"email": userEmail})
    # Kiểm tra xem user có tồn tại hay không
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    # Xóa token liên quan đến user
    await tokens_collection.delete_many({"username": userEmail})
    
    return {"status": 200, "message": "User deleted successfully"}


@router.put("/update/{userEmail}")
async def update_user(userEmail: str, updated_data: dict, user: dict = Depends(get_current_user)):
    # Kiểm tra xem người dùng đã đăng nhập hay chưa
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    # Cập nhật thông tin user trong database
    
    print("voday neee")
    result = await users_collection.update_one(
        {"email": userEmail},
        {"$set": {"full_name": updated_data.get("full_name"), "role": updated_data.get("role")}}
    )
    # Kiểm tra xem user có tồn tại hay không
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": 200, "message": "User updated successfully"}

