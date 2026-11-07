from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Білім беру платформасының backend API-і (FastAPI + Keycloak + PostgreSQL + Ollama)",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS баптауы
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Негізгі API маршруттарын қосу
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["Жүйелік"])
async def health_check():
    """
    Сервер мен қызметтердің жұмыс істеп тұрғанын тексеру.
    """
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

