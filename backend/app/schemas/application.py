from pydantic import BaseModel
from typing import Literal


class ApplicationCreate(BaseModel):
    job_id: int


class ApplicationStatusUpdate(BaseModel):
    status: Literal[
        "Applied",
        "Shortlisted",
        "Interview Scheduled",
        "Rejected",
        "Selected"
      ]


class ApplicationResponse(BaseModel):
    id: int
    candidate_id: int
    job_id: int
    status: str

    class Config:
        from_attributes = True