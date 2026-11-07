from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.core.security import AuthenticatedUser, get_current_user, require_roles
from app.db.session import get_db
from app.models.test import Test, Question, TestSubmission
from app.schemas.test import TestCreate, TestResponse, SubmitAnswers, SubmissionResponse

router = APIRouter()


@router.post("/", response_model=TestResponse)
async def create_test(
    test_in: TestCreate,
    current_user: Annotated[AuthenticatedUser, Depends(require_roles(["teacher", "admin"]))],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Тек Мұғалімдер үшін: жаңа тест пен оның сұрақтарын құру.
    """
    new_test = Test(
        title=test_in.title,
        description=test_in.description,
        time_limit_minutes=test_in.time_limit_minutes,
        teacher_id=current_user.id
    )
    db.add(new_test)
    await db.flush()

    for q in test_in.questions:
        new_q = Question(
            test_id=new_test.id,
            text=q.text,
            options=q.options,
            correct_answer=q.correct_answer,
            points=q.points
        )
        db.add(new_q)

    await db.commit()
    await db.refresh(new_test)

    # сұрақтарымен бірге жүктеу
    stmt = select(Test).where(Test.id == new_test.id).options(selectinload(Test.questions))
    res = await db.execute(stmt)
    return res.scalar_one()


@router.get("/", response_model=list[TestResponse])
async def list_tests(
    current_user: Annotated[AuthenticatedUser, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Барлық пайдаланушылар үшін: тесттер тізімін алу.
    """
    stmt = select(Test).options(selectinload(Test.questions))
    result = await db.execute(stmt)
    return result.scalars().all()


@router.post("/{test_id}/submit", response_model=SubmissionResponse)
async def submit_test(
    test_id: int,
    submission_in: SubmitAnswers,
    current_user: Annotated[AuthenticatedUser, Depends(require_roles(["student"]))],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Тек Студенттер үшін: тест тапсыру және автоматты бағалау.
    """
    stmt = select(Test).where(Test.id == test_id).options(selectinload(Test.questions))
    res = await db.execute(stmt)
    test = res.scalar_one_or_none()

    if not test:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Тест табылмады")

    total_score = 0
    total_points = sum(q.points for q in test.questions)

    # Авто-тексеру логикасы
    for q in test.questions:
        student_ans = submission_in.answers.get(str(q.id))
        if student_ans and student_ans.strip().lower() == q.correct_answer.strip().lower():
            total_score += q.points

    submission = TestSubmission(
        test_id=test.id,
        student_id=current_user.id,
        score=total_score,
        total_points=total_points,
        answers=submission_in.answers,
        feedback=f"Нәтиже: {total_points} баллдан {total_score} жиналды."
    )
    db.add(submission)
    await db.commit()
    await db.refresh(submission)
    return submission

