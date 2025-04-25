from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

class TokenSchema(BaseModel):
    username: str
    token: str
    expires_at: datetime
    created_at: datetime
    device_info: Optional[str] = None
    is_revoked: bool = False

    class Config:
        allow_population_by_field_name = True

class LogoutRequest(BaseModel):
    token: str
