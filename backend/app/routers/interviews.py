from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.interview import Interview
from app.schemas.interview import InterviewCreate, FeedbackUpdate
router = APIRouter()


# Create Interview
@router.post("/")
def create_interview(
    payload: InterviewCreate,
    db: Session = Depends(get_db)
):
    interview = Interview(
        application_id=payload.application_id,
        interview_date=payload.interview_date,
        interview_time=payload.interview_time,
        meeting_link=payload.meeting_link
    )

    db.add(interview)
    db.commit()
    db.refresh(interview)

    return interview


# Get All Interviews
@router.get("/")
def get_interviews(db: Session = Depends(get_db)):
    return db.query(Interview).all()


# Get Interview By ID
@router.get("/{interview_id}")
def get_interview(
    interview_id: int,
    db: Session = Depends(get_db)
):
    interview = db.query(Interview).filter(
        Interview.id == interview_id
    ).first()

    if not interview:
        return {"error": "Interview not found"}

    return interview


# Delete Interview
@router.delete("/{interview_id}")
def delete_interview(
    interview_id: int,
    db: Session = Depends(get_db)
):
    interview = db.query(Interview).filter(
        Interview.id == interview_id
    ).first()

    if not interview:
        return {"error": "Interview not found"}

    db.delete(interview)
    db.commit()

    return {"message": "Interview deleted"}

@router.patch("/{interview_id}/feedback")
def update_feedback(
    interview_id: int,
    payload: FeedbackUpdate,
    db: Session = Depends(get_db)
):
    interview = db.query(Interview).filter(
        Interview.id == interview_id
    ).first()

    if not interview:
        return {"error": "Interview not found"}

    interview.feedback = payload.feedback

    db.commit()
    db.refresh(interview)

    return interview