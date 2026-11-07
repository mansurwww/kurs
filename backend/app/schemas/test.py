from typing import Any
from pydantic import BaseModel


class QuestionCreate(BaseModel):
    text: str
    options: list[dict[str, Any]]
    correct_answer: str
    points: int = 1


class QuestionResponse(QuestionCreate):
    id: int

    class Config:
        from_attributes = True


class TestCreate(BaseModel):
    title: str
    description: str | None = None
    time_limit_minutes: int = 30
    questions: list[QuestionCreate] = []


class TestResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    time_limit_minutes: int
    teacher_id: str
    questions: list[QuestionResponse] = []

    class Config:
        from_attributes = True


class SubmitAnswers(BaseModel):
    # {"1": "A", "2": "C"}
    answers: dict[str, str]


class SubmissionResponse(BaseModel):
    id: int
    test_id: int
    student_id: str
    score: int
    total_points: int
    feedback: str | None = None

    class Config:
        from_attributes = True

