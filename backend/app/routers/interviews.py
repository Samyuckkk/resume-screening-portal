from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def interviews_test():
    return {"message": "Interviews Router"}