from pydantic import BaseModel


class ResumeCreate(BaseModel):
    file_url: str
    skills: str
    education: str
    experience: str


class ResumeResponse(BaseModel):
    id: int
    candidate_id: int
    file_url: str
    skills: str
    education: str
    experience: str

    class Config:
        from_attributes = True