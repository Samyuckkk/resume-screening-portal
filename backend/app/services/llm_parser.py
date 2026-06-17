import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


def extract_resume_details(text):

    prompt = f"""
You are an ATS Resume Parser.

Extract:
1. Technical Skills
2. Education
3. Work Experience

Return ONLY valid JSON.

Schema:

{{
  "skills": [],
  "education": [],
  "experience": []
}}

Rules:
- No explanation
- No markdown
- No ```json block
- Return valid JSON only

Resume:

{text[:12000]}
"""

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            # "model": "google/gemma-4-31b-it:free",
            "model": "openai/gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }
    )

    print("STATUS:", response.status_code)
    print("TEXT:", response.text)

    response.raise_for_status()

    result = response.json()

    if "choices" not in result:
        raise Exception(
            f"OpenRouter Error: {result}"
        )

    content = result["choices"][0]["message"]["content"]

    content = content.replace("```json", "")
    content = content.replace("```", "")
    content = content.strip()

    try:
        return json.loads(content)

    except Exception:
        print("Failed to parse JSON:")
        print(content)

        return {
            "skills": [],
            "education": [],
            "experience": []
        }