
from sqlalchemy import Column, Integer, String, ForeignKey

from app.base import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    candidate_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    job_id = Column(
        Integer,
        ForeignKey("jobs.id")
    )

    status = Column(
        String,
        default="Applied"
    )