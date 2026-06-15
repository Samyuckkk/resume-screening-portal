from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def jobs_test():
    return {"message": "Jobs Router"}