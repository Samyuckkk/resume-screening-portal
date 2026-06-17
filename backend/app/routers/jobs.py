from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.job import JobCreate, JobResponse
from app.models.job import Job
from sqlalchemy.exc import IntegrityError

router = APIRouter()

@router.post("/", response_model=JobResponse)
def create_job(job: JobCreate, db: Session = Depends(get_db)) -> JobResponse:
    """Create a new job posting"""
    # Note: recruiter_id will be added when authentication is implemented
    job_data = Job(
        title=job.title,
        description=job.description,
        location=job.location,
        salary=job.salary,
        recruiter_id=1  # Temporary placeholder until auth is implemented
    )
    db.add(job_data)
    db.commit()
    db.refresh(job_data)
    return job_data

@router.get("/", response_model=list[JobResponse])
def get_jobs(db: Session = Depends(get_db)):
    """Get all job postings"""
    jobs = db.query(Job).all()
    return jobs

@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    """Get a specific job by ID"""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.put("/{job_id}", response_model=JobResponse)
def update_job(job_id: int, job: JobCreate, db: Session = Depends(get_db)) -> JobResponse:
    """Update an existing job"""
    # First check if job exists
    job_db = db.query(Job).filter(Job.id == job_id).first()
    if not job_db:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Note: Authorization check will be added when authentication is implemented
    job_db.title = job.title
    job_db.description = job.description
    job_db.location = job.location
    job_db.salary = job.salary
    
    db.commit()
    db.refresh(job_db)
    return job_db


@router.delete("/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job_db = db.query(Job).filter(Job.id == job_id).first()

    if not job_db:
        raise HTTPException(status_code=404, detail="Job not found")

    try:
        db.delete(job_db)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Cannot delete job because applications exist for this job"
        )

    return {"message": "Job deleted successfully"}