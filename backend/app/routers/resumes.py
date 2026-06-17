from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from app.services.resume_service import upload_resume_to_storage
from sqlalchemy.orm import Session
from fastapi import Depends
from app.database import get_db
from app.models.resume import Resume
from app.services.resume_parser import extract_text_from_pdf
from app.services.llm_parser import extract_resume_details
import json

router = APIRouter()


@router.get("/")
def resumes_test():
    return {"message": "Resumes Router"}


@router.post("/upload")
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    public_url = upload_resume_to_storage(file)

    resume = Resume(
        candidate_id=1,
        file_url=public_url
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "message": "Resume uploaded successfully",
        "resume_id": resume.id,
        "file_url": public_url
    }
# TODO:
# Replace candidate_id=1 with current_user.id
# after JWT authentication is implemented

@router.get("/candidate/{candidate_id}")
def get_candidate_resume(
    candidate_id: int,
    db: Session = Depends(get_db)
):
    resume = (
        db.query(Resume)
        .filter(Resume.candidate_id == candidate_id)
        .first()
    )

    if not resume:
        return {
            "message": "Resume not found"
        }

    return resume


@router.post("/parse/{resume_id}")
def parse_resume(
    resume_id: int,
    db: Session = Depends(get_db)
):
    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id)
        .first()
    )

    if not resume:
        return {
            "message": "Resume not found"
        }

    text = extract_text_from_pdf(
        resume.file_url
    )

    parsed_data = extract_resume_details(text)

    resume.parsed_text = text

    resume.skills = json.dumps(
        parsed_data.get("skills", [])
    )

    resume.education = json.dumps(
        parsed_data.get("education", [])
    )

    resume.experience = json.dumps(
        parsed_data.get("experience", [])
    )

    db.commit()
    db.refresh(resume)

    return {
        "message": "Resume parsed successfully",
        "skills": parsed_data.get("skills", []),
        "education": parsed_data.get("education", []),
        "experience": parsed_data.get("experience", [])
    }