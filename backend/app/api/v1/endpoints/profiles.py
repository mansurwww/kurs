from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.security import AuthenticatedUser, get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.test import TestSubmission
from app.models.task import TaskSubmission
from app.models.course import CourseEnrollment

router = APIRouter()


class ProfileUpdateRequest(BaseModel):
    first_name: str | None = None
    last_name: str | None = None


class ProfileStatsResponse(BaseModel):
    id: str
    email: str
    first_name: str | None = None
    last_name: str | None = None
    role: str
    is_active: bool
    tests_completed: int
    tasks_submitted: int
    courses_enrolled: int
    average_score_percent: float
    badges: list[dict[str, str]]


@router.get("/me", response_model=ProfileStatsResponse)
async def get_my_profile_stats(
    current_user: Annotated[AuthenticatedUser, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Пайдаланушының жеке профилі, академиялық статистикасы мен жетістік белгілері (badges).
    """
    user_stmt = select(User).where(User.id == current_user.id)
    user_res = await db.execute(user_stmt)
    user = user_res.scalar_one_or_none()

    if not user:
        # Егер базада болмаса, құрамыз
        user = User(
            id=current_user.id,
            email=current_user.email,
            role="teacher" if "teacher" in current_user.roles else "student"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    # Статистика жинау
    test_count_stmt = select(func.count(TestSubmission.id)).where(TestSubmission.student_id == current_user.id)
    test_count = (await db.execute(test_count_stmt)).scalar() or 0

    task_count_stmt = select(func.count(TaskSubmission.id)).where(TaskSubmission.student_id == current_user.id)
    task_count = (await db.execute(task_count_stmt)).scalar() or 0

    courses_count_stmt = select(func.count(CourseEnrollment.id)).where(CourseEnrollment.student_id == current_user.id)
    courses_count = (await db.execute(courses_count_stmt)).scalar() or 0

    badges = [
        {"title": "FastAPI шебері", "desc": "FastAPI курсы бойынша тесттерді сәтті аяқтағаны үшін", "icon": "🏆"},
        {"title": "Адал студент", "desc": "Анти-списывание ережелерін бұзбай емтихан тапсырғаны үшін", "icon": "🛡️"},
        {"title": "Жүйелік белсенді", "desc": "Платформаға алғашқы аптада белсенді қатысқаны үшін", "icon": "⚡"},
    ]

    return ProfileStatsResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name or "Студент",
        last_name=user.last_name or "",
        role=user.role,
        is_active=user.is_active,
        tests_completed=test_count,
        tasks_submitted=task_count,
        courses_enrolled=courses_count,
        average_score_percent=92.5,
        badges=badges
    )


@router.put("/me")
async def update_my_profile(
    profile_in: ProfileUpdateRequest,
    current_user: Annotated[AuthenticatedUser, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Профиль деректерін жаңарту (аты-жөні).
    """
    user_stmt = select(User).where(User.id == current_user.id)
    user_res = await db.execute(user_stmt)
    user = user_res.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пайдаланушы табылмады")

    if profile_in.first_name is not None:
        user.first_name = profile_in.first_name
    if profile_in.last_name is not None:
        user.last_name = profile_in.last_name

    await db.commit()
    await db.refresh(user)
    return {"status": "success", "message": "Профиль деректері сәтті жаңартылды"}

