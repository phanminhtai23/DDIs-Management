# routes/drugs.py
from fastapi import APIRouter, HTTPException, Depends
from utils.security import get_current_user
from database import drugs_collection
from schemas.drug import Drug
from schemas.urls import ExtractRequest
import requests
import io
import PIL.Image

router = APIRouter()

from ai_models.ai_models import AI_Models
AI_Models = AI_Models()
AI_Models.load_models()

# Lất tất cả các thuốc /drugs
@router.get("/")
async def get_all_drugs(user: dict = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    drugs = await drugs_collection.find().to_list()
    # print("drugs: ", drugs)
    # Filter and validate drugs
    valid_drugs = []
    for drug in drugs:
        try:
            valid_drugs.append(Drug(**drug))
        except Exception as e:
            print(f"Validation error: {e}, skipping invalid drug: {drug}")

    # print("valid_drugs: ", valid_drugs)
    return {"message": "Got drugs successfully", "drugs": valid_drugs}
    # return {"message": "Got drugs successfully", "drugs": drugs}


# Thêm một thuốc mới
@router.post("/")
async def add_drug(drug: Drug, user: dict = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    existing_drug = await drugs_collection.find_one({"id": drug.id})
    if existing_drug:
        raise HTTPException(status_code=400, detail="Thuốc đã tồn tại !!")
    await drugs_collection.insert_one(drug.model_dump())
    return {"message": "Inserted successfully", "drugs": drug}


# tới đây
# Cập nhật thông tin một thuốc
@router.put("/{drug_id}")
async def update_drug(drug_id: str, drug: Drug, user: dict = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    result = await drugs_collection.update_one({"id": drug_id}, {"$set": drug.model_dump()})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Drug not found")
    return {"message": "Drug updated successfully", "drug": drug}


# Xóa một thuốc
@router.delete("/{drug_id}")
async def delete_drug(drug_id: str, user: dict = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    result = await drugs_collection.delete_one({"id": drug_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Drug not found")
    return {"message": "Drug deleted successfully"}

# Trích in4 thuốc từ file pdf
# Tìm thuốc theo ID
@router.get("/{drug_id}")
async def get_drug_by_id(drug_id: str, user: dict = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    drug = await drugs_collection.find_one({"id": drug_id})
    if not drug:
        raise HTTPException(status_code=404, detail="Drug not found")

    try:
        valid_drug = Drug(**drug)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation error: {e}")

    return {"message": "Drug found successfully", "drug": valid_drug}

@router.post("/extract")
async def extract_in4_from_pdf(document_urls: ExtractRequest, user: dict = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Không tìm thấy url
    if not document_urls:
        raise HTTPException(status_code=404, detail="document urls not found")

    # Kiểm tra dữ liệu hợp lệ
    if not document_urls.document_urls:
        raise HTTPException(
            status_code=400, detail="Không có dữ liệu được gửi")

    # Kiểm tra nếu gửi toàn ảnh
    if all(doc.endswith((".jpg", ".jpeg", ".png")) for doc in document_urls.document_urls):
        # Tiếp tục xử lý nếu chỉ gửi ảnh
        processed_imgs_arr = []
        for img_url in document_urls.document_urls:
            response = requests.get(img_url)
            if response.status_code != 200:
                raise HTTPException(
                    status_code=400, detail="Không thể truy cập file pdf từ url: {img_url} được cung cấp")
            image = PIL.Image.open(io.BytesIO(
                response.content))
            
            try:
                processed_image = AI_Models.image_processing_stream(image)  # xử lý ảnh qua flows: Yolo -> Craft -> CNN
                processed_imgs_arr.append(processed_image)
            except Exception as e:
                print(f"Error processing image: {str(e)}")
                raise HTTPException(
                    status_code=500, detail=f"Không tìm thấy thông tin thuốc: {str(e)}")
            # print("image: ", type(image), image.size)
            # processed_image.show()  # hiển thị ảnh
            
        DDIs_from_gemini = AI_Models.get_infor_drug_from_images(
            processed_imgs_arr)
        
        if DDIs_from_gemini is None:
            raise HTTPException(
                status_code=404, detail=f"Không tìm thấy thông tin thuốc")
        else:  # trích thành công có DDIs
            # print("Co gui anh:\n", type(DDIs_from_gemini), DDIs_from_gemini)
            return {"message": "Extracting successfully", "DDIs": DDIs_from_gemini}

    # Kiểm tra nếu gửi PDF
    elif len(document_urls.document_urls) == 1 and document_urls.document_urls[0].endswith(".pdf"):
        # Check if the PDF URL is accessible
        pdf_url = document_urls.document_urls[0]
        try:
            response = requests.get(pdf_url, allow_redirects=True)
            if response.status_code != 200:
                raise HTTPException(
                    status_code=400, detail="Không thể truy cập file pdf từ url được cung cấp")
            else:  # get file pdf ok -> gọi gemini
                
                DDIs_from_gemini = AI_Models.get_infor_drug_from_pdf(
                    pdf_url)
                
                if DDIs_from_gemini is None:
                    raise HTTPException(
                        status_code=404, detail=f"Không tìm thấy thông tin thuốc")
                else:  # trích thành công có DDIs
                    # print("type:\n", type(DDis_from_gemini), DDis_from_gemini)
                    return {"message": "Extracting successfully", "DDIs": DDIs_from_gemini}

        except Exception as e:
            raise HTTPException(status_code=404, detail=f"{str(e)}")

    # Nếu không hợp lệ
    else:
        raise HTTPException(
            status_code=400,
            detail="Dữ liệu không hợp lệ: chỉ được gửi 1 file PDF hoặc nhiều file ảnh (.jpg, .jpeg, .png)"
        )
