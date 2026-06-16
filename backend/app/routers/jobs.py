from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db
from app.schemas.job import JobCreate, JobResponse

router = APIRouter()

@router.post("/", response_model=JobResponse)
def create_job(job: JobCreate, db = Depends(get_db)):
    """Create a new job posting"""
    # For now, we'll use a default recruiter_id of 1
    # In production, this would come from authentication
    job_data = {
        "title": job.title,
        "description": job.description,
        "location": job.location,
        "salary": job.salary,
        "recruiter_id": 1  # Default recruiter, will be replaced with auth
    }
    result = db.table("jobs").insert(job_data).execute()
    return result.data[0]

@router.get("/", response_model=list[JobResponse])
def get_jobs(db = Depends(get_db)):
    """Get all job postings"""
    result = db.table("jobs").select("*").execute()
    return result.data

@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: int, db = Depends(get_db)):
    """Get a specific job by ID"""
    result = db.table("jobs").select("*").eq("id", job_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Job not found")
    return result.data[0]

@router.put("/{job_id}", response_model=JobResponse)
def update_job(job_id: int, job: JobCreate, db = Depends(get_db)):
    """Update an existing job"""
    job_data = {
        "title": job.title,
        "description": job.description,
        "location": job.location,
        "salary": job.salary
    }
    result = db.table("jobs").update(job_data).eq("id", job_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Job not found")
    return result.data[0]

@router.delete("/{job_id}")
def delete_job(job_id: int, db = Depends(get_db)):
    """Delete a job"""
    result = db.table("jobs").delete().eq("id", job_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": "Job deleted successfully"}