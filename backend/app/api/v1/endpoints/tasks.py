from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.security import AuthenticatedUser, get_current_user, require_roles
from app.db.session import get_db
from app.models.task import Task, TaskSubmission
from app.schemas.task import TaskCreate, TaskResponse, TaskSubmissionCreate, TaskSubmissionResponse

router = APIRouter()


@router.post("/", response_model=TaskResponse)
async def create_task(
    task_in: TaskCreate,
    current_user: Annotated[AuthenticatedUser, Depends(require_roles(["teacher", "admin"]))],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Тек Мұғалімдер үшін: жаңа үй тапсырмасын беру.
    """
    task = Task(
        title=task_in.title,
        description=task_in.description,
        due_date=task_in.due_date,
        teacher_id=current_user.id
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task


@router.get("/", response_model=list[TaskResponse])
async def list_tasks(
    current_user: Annotated[AuthenticatedUser, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Барлық тапсырмалар тізімін қарау.
    """
    stmt = select(Task)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.post("/{task_id}/submit", response_model=TaskSubmissionResponse)
async def submit_task(
    task_id: int,
    sub_in: TaskSubmissionCreate,
    current_user: Annotated[AuthenticatedUser, Depends(require_roles(["student"]))],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Тек Студенттер үшін: үй жұмысының жауабын жіберу.
    """
    stmt = select(Task).where(Task.id == task_id)
    res = await db.execute(stmt)
    task = res.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Тапсырма табылмады")

    submission = TaskSubmission(
        task_id=task.id,
        student_id=current_user.id,
        content=sub_in.content,
        file_url=sub_in.file_url
    )
    db.add(submission)
    await db.commit()
    await db.refresh(submission)
    return submission


@router.put("/submissions/{submission_id}/grade", response_model=TaskSubmissionResponse)
async def grade_submission(
    submission_id: int,
    grade: int,
    feedback: str | None = None,
    current_user: Annotated[AuthenticatedUser, Depends(require_roles(["teacher", "admin"]))],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Тек Мұғалімдер үшін: студенттің үй жұмысын тексеріп, баға мен пікір қою.
    """
    stmt = select(TaskSubmission).where(TaskSubmission.id == submission_id)
    res = await db.execute(stmt)
    sub = res.scalar_one_or_none()

    if not sub:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Жауап табылмады")

    sub.grade = grade
    if feedback:
        sub.teacher_feedback = feedback

    await db.commit()
    await db.refresh(sub)
    return sub

