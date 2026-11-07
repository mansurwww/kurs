import os
import uuid
import aiofiles
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import FileResponse

router = APIRouter()

UPLOAD_DIR = "/app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".zip", ".docx", ".txt", ".py"}
MAX_FILE_SIZE = 15 * 1024 * 1024  # 15 MB


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Үй жұмысына немесе тапсырмаға файл (PDF, сурет, архив) жүктеу.
    """
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Қолдау көрсетілмейтін файл түрі. Рұқсат етілгендер: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Қауіпсіз бірегей файл атауы
    unique_filename = f"{uuid.uuid4().hex}_{os.path.basename(file.filename)}"
    destination = os.path.join(UPLOAD_DIR, unique_filename)

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Файл көлемі 15 МБ-тан аспауы тиіс"
        )

    async with aiofiles.open(destination, "wb") as f:
        await f.write(content)

    return {
        "status": "success",
        "filename": unique_filename,
        "original_name": file.filename,
        "url": f"/api/v1/files/download/{unique_filename}"
    }


@router.get("/download/{filename}")
async def download_file(filename: str):
    """
    Жүктелген файлды ашу немесе жүктеп алу.
    """
    filepath = os.path.join(UPLOAD_DIR, os.path.basename(filename))
    if not os.path.isfile(filepath):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Файл табылмады")
    return FileResponse(filepath, filename=filename)

