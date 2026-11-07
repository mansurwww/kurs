import datetime
from pydantic import BaseModel


class CourseCreate(BaseModel):
    title: str
    code: str
    description: str


class CourseResponse(CourseCreate):
    id: int
    teacher_id: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True


class EnrollmentResponse(BaseModel):
    id: int
    course_id: int
    student_id: str
    enrolled_at: datetime.datetime

    class Config:
        from_attributes = True

