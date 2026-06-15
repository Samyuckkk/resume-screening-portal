from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def resumes_test():
    return {"message": "Resumes Router"}