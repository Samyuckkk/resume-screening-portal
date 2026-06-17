from pydantic import BaseModel


class ApplicationCreate(BaseModel):
    job_id: int


class ApplicationResponse(BaseModel):
    id: int
    candidate_id: int
    job_id: int
    status: str

    class Config:
        from_attributes = True