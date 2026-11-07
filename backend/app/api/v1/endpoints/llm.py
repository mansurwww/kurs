from typing import Annotated
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.security import AuthenticatedUser, require_roles
from app.llm.client import ollama_client

router = APIRouter()


class GenerateTestRequest(BaseModel):
    topic: str
    count: int = 5


class GenerateTestResponse(BaseModel):
    topic: str
    result: str


class ExplainRequest(BaseModel):
    question: str
    student_answer: str


class ExplainResponse(BaseModel):
    explanation: str


@router.post("/generate-test", response_model=GenerateTestResponse)
async def generate_test(
    request: GenerateTestRequest,
    current_user: Annotated[AuthenticatedUser, Depends(require_roles(["teacher", "admin"]))]
):
    """
    Тек Мұғалімдер үшін: Ollama арқылы тақырып бойынша тест сұрақтарын генерациялау.
    """
    result = await ollama_client.generate_test_questions(topic=request.topic, count=request.count)
    return GenerateTestResponse(topic=request.topic, result=result)


@router.post("/explain", response_model=ExplainResponse)
async def explain_mistake(
    request: ExplainRequest,
    current_user: Annotated[AuthenticatedUser, Depends(require_roles(["student"]))]
):
    """
    Тек Студенттер үшін: Ollama арқылы қатені талдау және AI-менторлық түсініктеме алу.
    """
    explanation = await ollama_client.evaluate_answer(
        question=request.question,
        student_answer=request.student_answer
    )
    return ExplainResponse(explanation=explanation)

