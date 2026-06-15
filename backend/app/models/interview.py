from sqlalchemy import Column, Integer, String, ForeignKey

from app.base import Base


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)

    application_id = Column(
        Integer,
        ForeignKey("applications.id")
    )

    interview_date = Column(String)

    interview_time = Column(String)

    meeting_link = Column(String)

    feedback = Column(String)