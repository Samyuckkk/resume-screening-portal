import requests
import pdfplumber
import tempfile


def extract_text_from_pdf(pdf_url):
    response = requests.get(pdf_url)

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".pdf"
    ) as temp_file:

        temp_file.write(response.content)

        text = ""

        with pdfplumber.open(temp_file.name) as pdf:

            for page in pdf.pages:

                page_text = page.extract_text()

                if page_text:
                    text += page_text + "\n"

    return text