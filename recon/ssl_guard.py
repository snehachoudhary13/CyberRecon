import ssl
import socket
from datetime import datetime

def analyze_ssl(domain):
    result = {}

    try:
        context = ssl.create_default_context()
        with socket.create_connection((domain, 443), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=domain) as ssock:
                cert = ssock.getpeercert()

                # TLS version
                result["tls_version"] = ssock.version()

                # Certificate issuer
                issuer = dict(x[0] for x in cert.get("issuer", []))
                result["certificate_issuer"] = issuer.get("organizationName", "Unknown")

                # Certificate expiry
                expiry_date = cert.get("notAfter")
                expiry = datetime.strptime(expiry_date, "%b %d %H:%M:%S %Y %Z")
                result["certificate_expiry"] = expiry.strftime("%Y-%m-%d")

                # Expiry check
                result["certificate_status"] = (
                    "Valid" if expiry > datetime.utcnow() else "Expired"
                )

                result["https"] = "Enabled"
                result["status"] = "Secure"

    except Exception as e:
        result["https"] = "Not Enabled"
        result["status"] = "Insecure"
        result["error"] = str(e)

    return result