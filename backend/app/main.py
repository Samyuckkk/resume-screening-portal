from fastapi import FastAPI

from app.base import Base
from app.database import engine

# Models
from app.models.user import User
from app.models.job import Job
from app.models.application import Application
from app.models.resume import Resume
from app.models.interview import Interview

# Routers
from app.routers.auth import router as auth_router
from app.routers.jobs import router as jobs_router
from app.routers.applications import router as applications_router
from app.routers.resumes import router as resumes_router
from app.routers.interviews import router as interviews_router

from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="Recruvo"
)

# Configure CORS Middleware
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,https://resume-screening-portal.onrender.com"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Auth"]
)

app.include_router(
    jobs_router,
    prefix="/jobs",
    tags=["Jobs"]
)

app.include_router(
    applications_router,
    prefix="/applications",
    tags=["Applications"]
)

app.include_router(
    resumes_router,
    prefix="/resumes",
    tags=["Resumes"]
)

app.include_router(
    interviews_router,
    prefix="/interviews",
    tags=["Interviews"]
)

@app.get("/")
def home():
    return {"message": "Backend Running"}