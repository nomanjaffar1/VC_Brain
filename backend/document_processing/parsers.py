import re

def parse_pitch_deck_text(raw_pdf_text: str) -> str:
    """Cleans up raw PDF text from a pitch deck."""
    # Remove extra whitespaces and newline characters
    cleaned = re.sub(r'\s+', ' ', raw_pdf_text).strip()
    return cleaned

def parse_github_repo_text(readme_text: str, code_summaries: str) -> str:
    """Fuses README and code summaries into a single indexable string."""
    return f"README:\n{readme_text}\n\nCODE CONTEXT:\n{code_summaries}"

def parse_linkedin_profile(profile_data: dict) -> str:
    """Converts structured LinkedIn data into narrative text for FAISS."""
    narrative = f"Name: {profile_data.get('name', '')}\n"
    narrative += f"Headline: {profile_data.get('headline', '')}\n"
    narrative += "Experience:\n"
    for exp in profile_data.get('experience', []):
        narrative += f"- {exp.get('title')} at {exp.get('company')} ({exp.get('duration')})\n"
    return narrative
