from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.application import Application
from app.models.job import Job
from app.models.user import User

from app.schemas.application import (
    ApplicationCreate,
    ApplicationStatusUpdate,
    ApplicationResponse
)

from app.routers.auth import get_current_user_payload

router = APIRouter()


@router.post("/", response_model=ApplicationResponse)
def apply_for_job(
    application: ApplicationCreate,
    token_payload: dict = Depends(get_current_user_payload),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == int(token_payload["sub"])
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.role != "applicant":
        raise HTTPException(
            status_code=403,
            detail="Only applicants can apply for jobs"
        )

    job = db.query(Job).filter(
        Job.id == application.job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    existing_application = db.query(Application).filter(
        Application.candidate_id == user.id,
        Application.job_id == application.job_id
    ).first()

    if existing_application:
        raise HTTPException(
            status_code=400,
            detail="You have already applied for this job"
        )

    new_application = Application(
        candidate_id=user.id,
        job_id=application.job_id,
        status="Applied"
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return ApplicationResponse(
        id=new_application.id,
        candidate_id=new_application.candidate_id,
        job_id=new_application.job_id,
        status=new_application.status,
        candidate_name=user.name,
        candidate_email=user.email
    )


@router.get("/my", response_model=list[ApplicationResponse])
def get_my_applications(
    token_payload: dict = Depends(get_current_user_payload),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == int(token_payload["sub"])
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.role != "applicant":
        raise HTTPException(
            status_code=403,
            detail="Only applicants can view their own applications"
        )

    applications = db.query(Application).filter(
        Application.candidate_id == user.id
    ).all()

    return [
        ApplicationResponse(
            id=app.id,
            candidate_id=app.candidate_id,
            job_id=app.job_id,
            status=app.status,
            candidate_name=user.name,
            candidate_email=user.email
        )
        for app in applications
    ]


@router.get("/job/{job_id}", response_model=list[ApplicationResponse])
def get_applicants_for_job(
    job_id: int,
    token_payload: dict = Depends(get_current_user_payload),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == int(token_payload["sub"])
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.role not in ["recruiter", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Only recruiters and admins can view applicants"
        )

    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    results = db.query(Application, User).join(
        User, Application.candidate_id == User.id
    ).filter(
        Application.job_id == job_id
    ).all()

    return [
        ApplicationResponse(
            id=app.id,
            candidate_id=app.candidate_id,
            job_id=app.job_id,
            status=app.status,
            candidate_name=u.name,
            candidate_email=u.email
        )
        for app, u in results
    ]


@router.put("/{application_id}", response_model=ApplicationResponse)
def update_application_status(
    application_id: int,
    update_data: ApplicationStatusUpdate,
    token_payload: dict = Depends(get_current_user_payload),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == int(token_payload["sub"])
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.role not in ["recruiter", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Only recruiters and admins can update application status"
        )

    application = db.query(Application).filter(
        Application.id == application_id
    ).first()

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    application.status = update_data.status

    db.commit()
    db.refresh(application)

    candidate = db.query(User).filter(User.id == application.candidate_id).first()

    return ApplicationResponse(
        id=application.id,
        candidate_id=application.candidate_id,
        job_id=application.job_id,
        status=application.status,
        candidate_name=candidate.name if candidate else None,
        candidate_email=candidate.email if candidate else None
    )