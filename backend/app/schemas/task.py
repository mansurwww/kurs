import datetime
from pydantic import BaseModel


class TaskCreate(BaseModel):
    title: str
    description: str
    due_date: datetime.datetime | None = None


class TaskResponse(TaskCreate):
    id: int
    teacher_id: str

    class Config:
        from_attributes = True


class TaskSubmissionCreate(BaseModel):
    content: str
    file_url: str | None = None


class TaskSubmissionResponse(BaseModel):
    id: int
    task_id: int
    student_id: str
    content: str
    file_url: str | None = None
    grade: int | None = None
    teacher_feedback: str | None = None

    class Config:
        from_attributes = True

