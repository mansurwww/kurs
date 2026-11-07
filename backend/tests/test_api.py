import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_check(async_client: AsyncClient):
    """
    /health эндпоинтінің дұрыс жауап беретінін тексеру.
    """
    response = await async_client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_public_routes(async_client: AsyncClient):
    """
    OpenAPI спецификациясы қолжетімді екенін тексеру.
    """
    response = await async_client.get("/api/v1/openapi.json")
    assert response.status_code == 200
    data = response.json()
    assert "paths" in data
    assert "/api/v1/courses/" in data["paths"]
    assert "/api/v1/notifications/" in data["paths"]
    assert "/api/v1/gradebook/summary" in data["paths"]

