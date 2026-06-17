from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db

from app.models.job import Job
from app.models.user import User

from app.schemas.job import (
    JobCreate,
    JobResponse
)

from app.routers.auth import (
    get_current_user,
    require_roles
)

router = APIRouter()


# Create job
@router.post("/", response_model=JobResponse)
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("recruiter", "admin")
    )
):
    job_data = Job(
        title=job.title,
        description=job.description,
        location=job.location,
        salary=job.salary,
        recruiter_id=current_user.id
    )

    db.add(job_data)
    db.commit()
    db.refresh(job_data)

    return job_data


# Get all jobs
@router.get("/", response_model=list[JobResponse])
def get_jobs(
    db: Session = Depends(get_db)
):
    return db.query(Job).all()


# Get job by id
@router.get("/{job_id}", response_model=JobResponse)
def get_job(
    job_id: int,
    db: Session = Depends(get_db)
):
    job = (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return job


# Update job
@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("recruiter", "admin")
    )
):
    job_db = (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )

    if not job_db:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    if (
        current_user.role == "recruiter"
        and job_db.recruiter_id != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="You can only update your own jobs"
        )

    job_db.title = job.title
    job_db.description = job.description
    job_db.location = job.location
    job_db.salary = job.salary

    db.commit()
    db.refresh(job_db)

    return job_db


# Delete job
@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("recruiter", "admin")
    )
):
    job_db = (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )

    if not job_db:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    if (
        current_user.role == "recruiter"
        and job_db.recruiter_id != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own jobs"
        )

    try:
        db.delete(job_db)
        db.commit()

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=400,
            detail="Cannot delete job because applications exist for this job"
        )

    return {
        "message": "Job deleted successfully"
    }