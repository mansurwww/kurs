import datetime
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Course(Base):
    """
    Пәндер мен оқу курстарының кестесі.
    """
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)  # мысалы: CS101
    description: Mapped[str] = mapped_column(Text, nullable=False)
    teacher_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.datetime.utcnow
    )

    enrollments: Mapped[list["CourseEnrollment"]] = relationship("CourseEnrollment", back_populates="course", cascade="all, delete-orphan")


class CourseEnrollment(Base):
    """
    Студенттердің пәнге жазылу кестесі.
    """
    __tablename__ = "course_enrollments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    student_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    enrolled_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.datetime.utcnow
    )

    course: Mapped["Course"] = relationship("Course", back_populates="enrollments")

