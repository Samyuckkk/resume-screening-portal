from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db
from app.schemas.job import JobCreate, JobResponse
from app.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=JobResponse)
def create_job(job: JobCreate, db = Depends(get_db), current_user = Depends(get_current_user)) -> JobResponse:
    """Create a new job posting"""
    job_data = {
        "title": job.title,
        "description": job.description,
        "location": job.location,
        "salary": job.salary,
        "recruiter_id": current_user["id"]  # Use authenticated user's ID
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
def update_job(job_id: int, job: JobCreate, db = Depends(get_db), current_user = Depends(get_current_user)) -> JobResponse:
    """Update an existing job"""
    # First check if job exists and belongs to current user
    job_result = db.table("jobs").select("*").eq("id", job_id).execute()
    if not job_result.data:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Check if user owns this job
    if job_result.data[0]["recruiter_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to update this job")
    
    job_data = {
        "title": job.title,
        "description": job.description,
        "location": job.location,
        "salary": job.salary
    }
    result = db.table("jobs").update(job_data).eq("id", job_id).execute()
    return result.data[0]

@router.delete("/{job_id}")
def delete_job(job_id: int, db = Depends(get_db), current_user = Depends(get_current_user)):
    """Delete a job"""
    # First check if job exists and belongs to current user
    job_result = db.table("jobs").select("*").eq("id", job_id).execute()
    if not job_result.data:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Check if user owns this job
    if job_result.data[0]["recruiter_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this job")
    
    result = db.table("jobs").delete().eq("id", job_id).execute()
    return {"message": "Job deleted successfully"}