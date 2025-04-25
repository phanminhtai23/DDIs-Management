from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_URI, DATABASE_NAME

client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]
users_collection = db["users"]
drugs_collection = db["drugs"]
ddi_collection = db["drug_interaction"]
tokens_collection = db["tokens"]

print("Database connection successful !")
