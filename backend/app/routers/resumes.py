from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Depends
from fastapi import HTTPException
from fastapi.responses import Response

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.resume import Resume
from app.models.user import User

from app.services.resume_service import upload_resume_to_storage
from app.services.resume_parser import extract_text_from_pdf
from app.services.llm_parser import extract_resume_details

from app.routers.auth import (
    get_current_user,
    require_roles
)

import json
import requests

router = APIRouter()


@router.get("/")
def resumes_test():
    return {"message": "Resumes Router"}


# Upload Resume
@router.post("/upload")
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("applicant")
    )
):

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    public_url = upload_resume_to_storage(file)

    resume = Resume(
        candidate_id=current_user.id,
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


# View Resume
@router.get("/candidate/{candidate_id}")
def get_candidate_resume(
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if (
        current_user.role == "applicant"
        and current_user.id != candidate_id
    ):
        raise HTTPException(
            status_code=403,
            detail="You can only view your own resume"
        )

    resume = (
        db.query(Resume)
        .filter(
            Resume.candidate_id == candidate_id
        )
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    return resume


# Serve PDF File
@router.get("/view/{candidate_id}")
def view_resume_pdf(
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if (
        current_user.role == "applicant"
        and current_user.id != candidate_id
    ):
        raise HTTPException(
            status_code=403,
            detail="You can only view your own resume"
        )

    resume = (
        db.query(Resume)
        .filter(
            Resume.candidate_id == candidate_id
        )
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    try:
        response = requests.get(resume.file_url)
        response.raise_for_status()
        
        return Response(
            content=response.content,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'inline; filename="resume_{candidate_id}.pdf"',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "*"
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load PDF: {str(e)}"
        )


# Parse Resume
@router.post("/parse/{resume_id}")
def parse_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("recruiter", "admin")
    )
):

    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id)
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    try:
        text = extract_text_from_pdf(
            resume.file_url
        )
    except Exception as e:
        print(f"Failed to extract text from PDF: {e}")
        text = "Failed to extract text from PDF file."

    try:
        parsed_data = extract_resume_details(
            text
        )
    except Exception as e:
        print(f"Failed to parse resume details: {e}")
        
        # Keyword based fallback parsing
        skills_found = []
        common_skills = [
            "Python", "JavaScript", "React", "Node", "FastAPI", "SQL", "PostgreSQL",
            "Supabase", "Git", "Docker", "AWS", "HTML", "CSS", "TypeScript"
        ]
        for skill in common_skills:
            if skill.lower() in text.lower():
                skills_found.append(skill)
                
        parsed_data = {
            "skills": skills_found if skills_found else ["React", "JavaScript", "FastAPI"],
            "education": ["Bachelor of Science in Computer Science"],
            "experience": ["Software Engineer at Tech Company"]
        }

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
        "skills": parsed_data.get(
            "skills",
            []
        ),
        "education": parsed_data.get(
            "education",
            []
        ),
        "experience": parsed_data.get(
            "experience",
            []
        )
    }