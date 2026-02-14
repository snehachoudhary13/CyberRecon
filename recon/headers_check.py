import requests

SECURITY_HEADERS = [
    "Content-Security-Policy",
    "X-Frame-Options",
    "Strict-Transport-Security",
    "X-Content-Type-Options",
    "Referrer-Policy",
    "Permissions-Policy"
]

def analyze_headers(domain):
    result = {}

    try:
        url = "http://" + domain
        response = requests.get(url, timeout=5)

        response_headers = response.headers

        for header in SECURITY_HEADERS:
            if header in response_headers:
                result[header] = "Present"
            else:
                result[header] = "Missing"

    except Exception as e:
        result["error"] = str(e)

    return result                   