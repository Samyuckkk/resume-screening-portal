from sqlalchemy import Column, Integer, String, ForeignKey

from app.base import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)

    candidate_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    file_url = Column(String)

    skills = Column(String)

    education = Column(String)

    experience = Column(String)