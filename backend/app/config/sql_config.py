from sqlalchemy import create_engine
from app.config.settings import settings
from sqlalchemy.orm import sessionmaker

engine = create_engine(
    url=settings.DATABASE_URL
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()