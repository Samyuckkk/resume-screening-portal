from sqlalchemy import Column, Integer, String, ForeignKey

from app.base import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    description = Column(String, nullable=False)

    location = Column(String)

    salary = Column(Integer)

    recruiter_id = Column(
        Integer,
        ForeignKey("users.id")
    )