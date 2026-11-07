from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.security import AuthenticatedUser, get_current_user, require_roles
from app.db.session import get_db
from app.models.course import Course, CourseEnrollment
from app.schemas.course import CourseCreate, CourseResponse, EnrollmentResponse

router = APIRouter()


@router.post("/", response_model=CourseResponse)
async def create_course(
    course_in: CourseCreate,
    current_user: Annotated[AuthenticatedUser, Depends(require_roles(["teacher", "admin"]))],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Тек Мұғалімдер үшін: жаңа оқу курсын/пәнін ашу.
    """
    existing_stmt = select(Course).where(Course.code == course_in.code)
    existing_res = await db.execute(existing_stmt)
    if existing_res.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{course_in.code}' кодымен пән бұрыннан бар"
        )

    course = Course(
        title=course_in.title,
        code=course_in.code.upper(),
        description=course_in.description,
        teacher_id=current_user.id
    )
    db.add(course)
    await db.commit()
    await db.refresh(course)
    return course


@router.get("/", response_model=list[CourseResponse])
async def list_all_courses(
    current_user: Annotated[AuthenticatedUser, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Барлық қолжетімді пәндер тізімін алу.
    """
    stmt = select(Course)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.post("/{course_id}/enroll", response_model=EnrollmentResponse)
async def enroll_course(
    course_id: int,
    current_user: Annotated[AuthenticatedUser, Depends(require_roles(["student"]))],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Тек Студенттер үшін: таңдалған пәнге жазылу.
    """
    course_stmt = select(Course).where(Course.id == course_id)
    course_res = await db.execute(course_stmt)
    course = course_res.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пән табылмады")

    # Студент бұрын жазылған ба тексереміз
    check_stmt = select(CourseEnrollment).where(
        CourseEnrollment.course_id == course_id,
        CourseEnrollment.student_id == current_user.id
    )
    check_res = await db.execute(check_stmt)
    if check_res.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Сіз бұл пәнге бұрыннан жазылғансыз"
        )

    enrollment = CourseEnrollment(
        course_id=course_id,
        student_id=current_user.id
    )
    db.add(enrollment)
    await db.commit()
    await db.refresh(enrollment)
    return enrollment


@router.get("/my-courses", response_model=list[CourseResponse])
async def list_my_courses(
    current_user: Annotated[AuthenticatedUser, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Ағымдағы пайдаланушының жеке пәндері (мұғалім үшін оқытатын, студент үшін жазылған пәндері).
    """
    if "teacher" in current_user.roles:
        stmt = select(Course).where(Course.teacher_id == current_user.id)
        result = await db.execute(stmt)
        return result.scalars().all()
    else:
        stmt = select(Course).join(CourseEnrollment, Course.id == CourseEnrollment.course_id).where(
            CourseEnrollment.student_id == current_user.id
        )
        result = await db.execute(stmt)
        return result.scalars().all()

