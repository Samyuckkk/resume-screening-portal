from fastapi import FastAPI

# Routers
from app.routers.auth import router as auth_router
from app.routers.jobs import router as jobs_router
from app.routers.applications import router as applications_router
from app.routers.resumes import router as resumes_router
from app.routers.interviews import router as interviews_router

app = FastAPI(
    title="Resume Screening Portal"
)

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