from pydantic import BaseModel
from typing import List

class ExtractRequest(BaseModel):
    document_urls: List[str]