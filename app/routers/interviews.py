from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.interview import Interview
from app.models.user import User

from app.schemas.interview import (
    InterviewCreate,
    FeedbackUpdate
)

from app.routers.auth import (
    get_current_user,
    require_roles
)

router = APIRouter()


# Create interview
@router.post("/")
def create_interview(
    payload: InterviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("recruiter", "admin")
    )
):
    interview = Interview(
        application_id=payload.application_id,
        recruiter_id=current_user.id,
        interview_date=payload.interview_date,
        interview_time=payload.interview_time,
        meeting_link=payload.meeting_link
    )

    db.add(interview)
    db.commit()
    db.refresh(interview)

    return interview


# Get all interviews
@router.get("/")
def get_interviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("recruiter", "admin")
    )
):
    return db.query(Interview).all()


# Get interview by id
@router.get("/{interview_id}")
def get_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    interview = (
        db.query(Interview)
        .filter(Interview.id == interview_id)
        .first()
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    return interview


# Delete interview
@router.delete("/{interview_id}")
def delete_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("recruiter", "admin")
    )
):
    interview = (
        db.query(Interview)
        .filter(Interview.id == interview_id)
        .first()
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    if (
        current_user.role == "recruiter"
        and interview.recruiter_id != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own interviews"
        )

    db.delete(interview)
    db.commit()

    return {
        "message": "Interview deleted successfully"
    }


# Update feedback
@router.patch("/{interview_id}/feedback")
def update_feedback(
    interview_id: int,
    payload: FeedbackUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("recruiter", "admin")
    )
):
    interview = (
        db.query(Interview)
        .filter(Interview.id == interview_id)
        .first()
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    if (
        current_user.role == "recruiter"
        and interview.recruiter_id != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="You can only update your own interviews"
        )

    interview.feedback = payload.feedback

    db.commit()
    db.refresh(interview)

    return interview