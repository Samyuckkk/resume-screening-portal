from app.supabase_client import supabase
import uuid

def upload_resume_to_storage(file):
    file_bytes = file.file.read()

    # file_name = file.filename
    file_name = f"{uuid.uuid4()}_{file.filename}"


    response = supabase.storage.from_("resumes").upload(
        file_name,
        file_bytes
    )

    public_url = supabase.storage.from_("resumes").get_public_url(
        file_name
    )

    return public_url