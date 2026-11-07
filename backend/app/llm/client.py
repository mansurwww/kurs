from typing import Any
import httpx
from app.core.config import settings


class OllamaClient:
    """
    Жергілікті Ollama API-мен асинхронды жұмыс істеу клиенті.
    """

    def __init__(self, base_url: str = settings.OLLAMA_BASE_URL, default_model: str = settings.OLLAMA_DEFAULT_MODEL):
        self.base_url = base_url.rstrip("/")
        self.default_model = default_model

    async def generate_completion(self, prompt: str, model: str | None = None) -> str:
        """
        Мәтін немесе сұрақ генерациялау.
        """
        target_model = model or self.default_model
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": target_model,
                    "prompt": prompt,
                    "stream": False
                }
            )
            response.raise_for_status()
            data = response.json()
            return data.get("response", "")

    async def generate_test_questions(self, topic: str, count: int = 5) -> str:
        """
        Мұғалімдер үшін берілген тақырып бойынша тест сұрақтарын автоматты құрастыру.
        """
        prompt = (
            f"Сен оқытушының көмекшісісің. Келесі тақырып бойынша {count} тест сұрағын "
            f"қазақ тілінде құрастыр: '{topic}'. Әр сұрақтың 4 нұсқасы және дұрыс жауабы көрсетілсін."
        )
        return await self.generate_completion(prompt)

    async def evaluate_answer(self, question: str, student_answer: str) -> str:
        """
        Студенттің жауабын тексеру және түсіндірме беру (AI-ментор).
        """
        prompt = (
            f"Сұрақ: {question}\n"
            f"Студент жауабы: {student_answer}\n"
            f"Жауапты тексеріп, оның дұрыс немесе қате екенін және себебін қазақ тілінде түсіндіріп бер."
        )
        return await self.generate_completion(prompt)


ollama_client = OllamaClient()

