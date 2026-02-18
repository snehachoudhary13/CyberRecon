import requests
from urllib.parse import urlparse

def inspect_url(url):
    result = {
        "url": url,
        "suspicious_patterns": []
    }

    try:
        parsed = urlparse(url)

        # HTTPS check
        if parsed.scheme != "https":
            result["https"] = "Not Secure"
            result["suspicious_patterns"].append("Uses HTTP")
        else:
            result["https"] = "Secure"

        # Suspicious characters
        if "@" in url:
            result["suspicious_patterns"].append("Contains '@' symbol")

        if parsed.hostname and parsed.hostname.replace(".", "").isdigit():
            result["suspicious_patterns"].append("IP-based URL")

        # Redirect check
        response = requests.get(url, timeout=5, allow_redirects=True)
        result["redirects"] = len(response.history)

        # Risk level
        if len(result["suspicious_patterns"]) >= 2:
            result["risk_level"] = "High"
        elif len(result["suspicious_patterns"]) == 1:
            result["risk_level"] = "Medium"
        else:
            result["risk_level"] = "Low"

    except Exception as e:
        result["error"] = str(e)
        result["risk_level"] = "Unknown"

    return result