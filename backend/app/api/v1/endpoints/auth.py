from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.security import AuthenticatedUser, get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_my_profile(
    current_user: Annotated[AuthenticatedUser, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Keycloak токенінен ағымдағы пайдаланушы профилін алу немесе дерекқормен синхрондау.
    """
    stmt = select(User).where(User.id == current_user.id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        # Пайдаланушы алғаш рет кірсе, дерекқорға жазамыз
        primary_role = "student"
        if "teacher" in current_user.roles:
            primary_role = "teacher"
        elif "admin" in current_user.roles:
            primary_role = "admin"

        user = User(
            id=current_user.id,
            email=current_user.email,
            role=primary_role,
            is_active=True
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    return user

