from typing import Annotated, Any
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.core.config import settings

security_bearer = HTTPBearer()


class AuthenticatedUser:
    def __init__(self, sub: str, email: str, roles: list[str], raw_token: dict[str, Any]):
        self.id = sub
        self.email = email
        self.roles = roles
        self.raw_token = raw_token

    def has_role(self, role: str) -> bool:
        return role in self.roles


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security_bearer)]
) -> AuthenticatedUser:
    """
    Keycloak JWT токенін тексеру және пайдаланушы деректерін (рөлдерін) алу.
    """
    token = credentials.credentials
    try:
        # Продакшнда Keycloak JWKS public key арқылы верификацияланады.
        # Бастапқы кезеңде токеннің payload бөлігі декодталады.
        payload = jwt.decode(token, options={"verify_signature": False})
        
        user_id: str = payload.get("sub", "")
        email: str = payload.get("email", "")
        
        # Keycloak realm_access рөлдерін алу
        realm_access = payload.get("realm_access", {})
        roles: list[str] = realm_access.get("roles", [])

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Токеннен пайдаланушы ID табылмады"
            )

        return AuthenticatedUser(sub=user_id, email=email, roles=roles, raw_token=payload)
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Жарамсыз немесе мерзімі өткен токен"
        )


def require_roles(allowed_roles: list[str]):
    """
    Рөлге негізделген қолжетімділікті тексеру dependency (RBAC: student, teacher, admin).
    """
    async def role_checker(
        current_user: Annotated[AuthenticatedUser, Depends(get_current_user)]
    ) -> AuthenticatedUser:
        if not any(role in current_user.roles for role in allowed_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Бұл әрекетке рұқсат жоқ. Қажетті рөлдер: {allowed_roles}"
            )
        return current_user

    return role_checker

