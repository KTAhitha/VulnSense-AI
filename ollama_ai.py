import requests


OLLAMA_URL = "http://localhost:11434/api/generate"


def explain_vulnerability(cve_id, description):

    prompt = f"""
You are a cybersecurity vulnerability analyst.

Analyze this vulnerability:

CVE ID: {cve_id}

Description:
{description}

Give a simple security assessment with exactly these sections:

1. What is the vulnerability?
2. Severity
3. Possible impact
4. Recommended remediation

Keep the explanation concise and suitable for a security report.
"""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": "llama3.2:3b",
            "prompt": prompt,
            "stream": False
        },
        timeout=120
    )

    response.raise_for_status()

    data = response.json()

    return data.get("response", "")