import datetime
from typing import Any
from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Test(Base):
    """
    Мұғалімдер жасайтын тест кестесі.
    """
    __tablename__ = "tests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    time_limit_minutes: Mapped[int] = mapped_column(Integer, default=30)
    teacher_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.datetime.utcnow
    )

    questions: Mapped[list["Question"]] = relationship("Question", back_populates="test", cascade="all, delete-orphan")
    submissions: Mapped[list["TestSubmission"]] = relationship("TestSubmission", back_populates="test")


class Question(Base):
    """
    Тест сұрақтарының кестесі.
    """
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    test_id: Mapped[int] = mapped_column(ForeignKey("tests.id"), nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    # options: [{"id": "A", "text": "Вариант 1"}, {"id": "B", "text": "Вариант 2"}]
    options: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list)
    correct_answer: Mapped[str] = mapped_column(String(255), nullable=False)
    points: Mapped[int] = mapped_column(Integer, default=1)

    test: Mapped["Test"] = relationship("Test", back_populates="questions")


class TestSubmission(Base):
    """
    Студенттердің тапсырған тест нәтижелері.
    """
    __tablename__ = "test_submissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    test_id: Mapped[int] = mapped_column(ForeignKey("tests.id"), nullable=False)
    student_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    score: Mapped[int] = mapped_column(Integer, default=0)
    total_points: Mapped[int] = mapped_column(Integer, default=0)
    answers: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    feedback: Mapped[str | None] = mapped_column(Text, nullable=True)  # AI немесе мұғалім пікірі
    submitted_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.datetime.utcnow
    )

    test: Mapped["Test"] = relationship("Test", back_populates="submissions")

