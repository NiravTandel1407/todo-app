from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import RedirectResponse
from app.config.settings import settings
import uvicorn
from app.api.router import router
from app.models.TaskItem import Base
from app.config.sql_config import engine


from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION
)

# Enable CORS so the React frontend can communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/", include_in_schema=False)
async def read_root():
    return RedirectResponse(url="/docs")

if __name__ == "__main__":
    uvicorn.run(
        "main:app"
    )