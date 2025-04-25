from pydantic import BaseModel, EmailStr
from typing import List, Optional


# Drug model
class HoatChat(BaseModel):
    tenHoatChat: str
    nongDo: str


class Drug(BaseModel):
    id: str
    tenThuoc: str
    dotPheDuyet: str
    soQuyetDinh: str
    pheDuyet: str
    hieuLuc: Optional[str] = None
    soDangKy: str
    hoatChat: List[HoatChat]
    phanLoai: str
    taDuoc: str
    baoChe: str
    dongGoi: str
    tieuChuan: str
    tuoiTho: str
    congTySx: str
    congTySxCode: str
    nuocSx: str
    diaChiSx: str
    congTyDk: str
    nuocDk: str
    diaChiDk: str
    nhomThuoc: str

# Drug Interaction (DDI) model


class DrugInteraction(BaseModel):
    TenThuoc: str
    HoatChat_1: str
    HoatChat_2: str
    MucDoNghiemTrong: str
    CanhBaoTuongTacThuoc: str
