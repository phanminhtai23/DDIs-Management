from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_URI, DATABASE_NAME
import asyncio

# Khởi tạo kết nối
client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]
users_collection = db["users"]
drugs_collection = db["drugs"]
ddi_collection = db["drug_interaction"]
tokens_collection = db["tokens"]

async def test_database_connection():
    """
    Hàm test kết nối database - để gọi từ main.py khi khởi động dự án
    """
    try:
        print("🔍 Testing MongoDB connection...")
        # Test ping để kiểm tra kết nối thực sự
        await client.admin.command('ping')
        print("🏓 Ping MongoDB successful!")
        
        # Test database access
        db_list = await client.list_database_names()
        print(f"📚 Available databases: {db_list}")
        
        # Test collections
        collections = await db.list_collection_names()
        print(f"📁 Collections in {DATABASE_NAME}: {collections}")
        
        print("✅ Database connection test successful!")
        return True
    except Exception as e:
        print(f"❌ Database connection test failed: {e}")
        return False

# Test khi chạy trực tiếp file này
if __name__ == "__main__":
    print("🚀 Running database connection test...")
    result = asyncio.run(test_database_connection())
    if result:
        print("🎉 All tests passed!")
    else:
        print("💥 Tests failed!")

