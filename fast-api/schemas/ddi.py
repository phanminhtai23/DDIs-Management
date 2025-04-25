from pydantic import BaseModel
from typing import List, Optional


class DDI(BaseModel):
    id: Optional[str]
    TenThuoc: Optional[str] = None
    HoatChat_1: str
    HoatChat_2: str
    MucDoNghiemTrong: Optional[str] = "Không xác định"
    CanhBaoTuongTacThuoc: Optional[str] = "Không xác định"

class deleteRequest(BaseModel):
    HoatChat_1: str
    HoatChat_2: str