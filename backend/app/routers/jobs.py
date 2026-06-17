from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.job import JobCreate, JobResponse
from app.models.job import Job
from app.routers.auth import get_current_user_payload  # import auth

router = APIRouter()

@router.post("/", response_model=JobResponse)
def create_job(job: JobCreate, db: Session = Depends(get_db), token_payload: dict = Depends(get_current_user_payload)):
    if token_payload.get("role") != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can post jobs")
    job_data = Job(
        title=job.title,
        description=job.description,
        location=job.location,
        salary=job.salary,
        recruiter_id=int(token_payload["sub"])  # real user id from token
    )
    db.add(job_data)
    db.commit()
    db.refresh(job_data)
    return job_data