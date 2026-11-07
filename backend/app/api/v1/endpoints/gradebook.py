import csv
import io
from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.security import AuthenticatedUser, require_roles
from app.db.session import get_db
from app.models.user import User
from app.models.test import Test, TestSubmission
from app.models.task import Task, TaskSubmission

router = APIRouter()


@router.get("/summary")
async def get_gradebook_summary(
    current_user: Annotated[AuthenticatedUser, Depends(require_roles(["teacher", "admin"]))],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Мұғалім үшін барлық студенттердің тест және тапсырма бағаларының жиынтық кестесі.
    """
    test_subs_stmt = select(TestSubmission, Test, User).join(Test, TestSubmission.test_id == Test.id).join(User, TestSubmission.student_id == User.id)
    test_res = await db.execute(test_subs_stmt)
    test_rows = test_res.all()

    task_subs_stmt = select(TaskSubmission, Task, User).join(Task, TaskSubmission.task_id == Task.id).join(User, TaskSubmission.student_id == User.id)
    task_res = await db.execute(task_subs_stmt)
    task_rows = task_res.all()

    summary = []
    for sub, test, user in test_rows:
        summary.append({
            "type": "Тест",
            "student_name": f"{user.first_name or ''} {user.last_name or ''}".strip() or user.email,
            "email": user.email,
            "title": test.title,
            "score": f"{sub.score}/{sub.total_points}",
            "date": sub.submitted_at.strftime("%Y-%m-%d %H:%M") if sub.submitted_at else ""
        })

    for sub, task, user in task_rows:
        summary.append({
            "type": "Үй тапсырмасы",
            "student_name": f"{user.first_name or ''} {user.last_name or ''}".strip() or user.email,
            "email": user.email,
            "title": task.title,
            "score": str(sub.grade) if sub.grade is not None else "Тексерілмеген",
            "date": sub.submitted_at.strftime("%Y-%m-%d %H:%M") if sub.submitted_at else ""
        })

    return summary


@router.get("/export")
async def export_gradebook_csv(
    current_user: Annotated[AuthenticatedUser, Depends(require_roles(["teacher", "admin"]))],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Бағалар журналын Excel/CSV форматында жүктеу.
    """
    test_subs_stmt = select(TestSubmission, Test, User).join(Test, TestSubmission.test_id == Test.id).join(User, TestSubmission.student_id == User.id)
    test_res = await db.execute(test_subs_stmt)
    test_rows = test_res.all()

    output = io.StringIO()
    # Excel-де қазақ/кириллица әріптері дұрыс көрінуі үшін UTF-8 BOM
    output.write('\ufeff')
    writer = csv.writer(output, delimiter=';')

    writer.writerow(["Түрі", "Студент Аты-жөні", "Email", "Тақырыбы", "Баға / Балл", "Тапсырылған уақыты"])

    for sub, test, user in test_rows:
        name = f"{user.first_name or ''} {user.last_name or ''}".strip() or user.email
        date_str = sub.submitted_at.strftime("%Y-%m-%d %H:%M") if sub.submitted_at else ""
        writer.writerow(["Тест", name, user.email, test.title, f"{sub.score}/{sub.total_points}", date_str])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": "attachment; filename=gradebook_report.csv"}
    )

