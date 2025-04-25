from pydantic import BaseModel
from typing import List, Optional


class HoatChat(BaseModel):
    tenHoatChat: Optional[str]
    nongDo: Optional[str]

class Drug(BaseModel):
    id: str
    tenThuoc: str
    dotPheDuyet:Optional[str]
    soQuyetDinh:Optional[str]
    pheDuyet:Optional[str]
    hieuLuc: Optional[str] = None
    soDangKy: str
    hoatChat: List[HoatChat]
    phanLoai: Optional[str]
    taDuoc: Optional[str]
    baoChe:Optional[str]
    dongGoi:Optional[str]
    tieuChuan:Optional[str]
    tuoiTho:Optional[str]
    congTySx:Optional[str]
    congTySxCode:Optional[str]
    nuocSx:Optional[str]
    diaChiSx:Optional[str]
    congTyDk:Optional[str]
    nuocDk:Optional[str]
    diaChiDk:Optional[str]
    nhomThuoc:Optional[str]
    
# Định nghĩa Pydantic model để ánh xạ dữ liệu từ request



