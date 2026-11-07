from fastapi import APIRouter
from app.api.v1.endpoints import auth, tests, tasks, llm, files, gradebook, courses, notifications, profiles

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Аутентификация және Профиль"])
api_router.include_router(profiles.router, prefix="/profiles", tags=["Профиль және Статистика"])
api_router.include_router(courses.router, prefix="/courses", tags=["Пәндер мен Курстар (Courses)"])
api_router.include_router(tests.router, prefix="/tests", tags=["Тесттер және Сұрақтар"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["Тапсырмалар және Бағалау"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Хабарламалар (Notifications)"])
api_router.include_router(llm.router, prefix="/llm", tags=["Жергілікті AI (Ollama)"])
api_router.include_router(files.router, prefix="/files", tags=["Файлдарды Жүктеу (Upload)"])
api_router.include_router(gradebook.router, prefix="/gradebook", tags=["Бағалар Журналы және Экспорт"])

