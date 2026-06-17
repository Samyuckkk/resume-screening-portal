from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def applications_test():
    return {"message": "ApplicationS Router"}