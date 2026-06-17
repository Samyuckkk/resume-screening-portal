from pydantic import BaseModel


class InterviewCreate(BaseModel):
    application_id: int
    interview_date: str
    interview_time: str
    meeting_link: str


class FeedbackUpdate(BaseModel):
    feedback: str


class InterviewResponse(BaseModel):
    id: int
    application_id: int
    interview_date: str
    interview_time: str
    meeting_link: str
    feedback: str | None = None

    class Config:
        from_attributes = True