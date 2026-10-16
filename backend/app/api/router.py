from fastapi import APIRouter
from app.api.endpoints import tasks_endpoints  

router = APIRouter()

router.include_router(
    tasks_endpoints.router,
    prefix="/taskItems",
    tags=["Task Items"]
)