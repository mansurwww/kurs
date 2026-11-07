import json
import httpx
from config import settings


async def handle_ai_generate_quiz(payload: dict) -> dict:
    """
    RabbitMQ-дан келген тест сұрақтарын құрастыру тапсырмасын Ollama арқылы орындау.
    """
    topic = payload.get("topic", "Жалпы білім")
    count = payload.get("count", 5)

    prompt = (
        f"Оқытушы үшін келесі тақырып бойынша {count} тест сұрағын "
        f"қазақ тілінде құрастыр: '{topic}'. Әр сұрақта 4 нұсқа және дұрыс жауабы болсын."
    )

    async with httpx.AsyncClient(timeout=120.0) as client:
        try:
            resp = await client.post(
                f"{settings.OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": settings.OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False
                }
            )
            resp.raise_for_status()
            data = resp.json()
            return {"status": "success", "result": data.get("response", "")}
        except Exception as e:
            return {"status": "error", "message": str(e)}


async def handle_ai_evaluate_answer(payload: dict) -> dict:
    """
    Студент жауабын Ollama AI ментор арқылы тексеру.
    """
    question = payload.get("question", "")
    student_answer = payload.get("student_answer", "")

    prompt = (
        f"Сұрақ: {question}\n"
        f"Студент жауабы: {student_answer}\n"
        f"Жауапты тексеріп, нәтижесін және толық түсіндірмесін қазақ тілінде бер."
    )

    async with httpx.AsyncClient(timeout=120.0) as client:
        try:
            resp = await client.post(
                f"{settings.OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": settings.OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False
                }
            )
            resp.raise_for_status()
            data = resp.json()
            return {"status": "success", "explanation": data.get("response", "")}
        except Exception as e:
            return {"status": "error", "message": str(e)}

