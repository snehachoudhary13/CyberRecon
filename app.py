from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
from urllib.parse import urlparse

# -----------------------------
# IMPORT RECON MODULES
# -----------------------------
from recon.ip_lookup import get_ip
from recon.dns_lookup import get_dns_records
from recon.headers_check import analyze_headers
from recon.ssl_guard import analyze_ssl
from recon.url_inspector import inspect_url


# -----------------------------
# FLASK APP CONFIG
# -----------------------------
app = Flask(
    __name__,
    static_folder="frontend/recon-buddy-main/dist",
    template_folder="frontend/recon-buddy-main/dist"
)

# Enable CORS (safe even in prod)
CORS(app)


# -----------------------------
# NGROK WARNING BYPASS
# -----------------------------
@app.after_request
def add_ngrok_header(response):
    response.headers["ngrok-skip-browser-warning"] = "true"
    return response


# -----------------------------
# API ROUTES
# -----------------------------

def normalize_domain_target(target: str) -> str:
    value = (target or "").strip()
    if not value:
        raise ValueError("Target is required")

    if "://" in value:
        parsed = urlparse(value)
        if not parsed.hostname:
            raise ValueError("Invalid target format")
        return parsed.hostname

    # Allow accidental path suffixes and keep only hostname-like segment
    return value.split("/")[0]


def normalize_url_target(url_value: str) -> str:
    value = (url_value or "").strip()
    if not value:
        raise ValueError("URL is required")

    normalized = value if "://" in value else f"https://{value}"
    parsed = urlparse(normalized)
    if not parsed.netloc:
        raise ValueError("Invalid URL format")
    return normalized


@app.route("/ip/<path:domain>")
def ip_lookup(domain):
    try:
        normalized_domain = normalize_domain_target(domain)
        return jsonify({
            "domain": normalized_domain,
            "ip": get_ip(normalized_domain)
        })
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/dns/<path:domain>")
def dns_lookup(domain):
    try:
        normalized_domain = normalize_domain_target(domain)
        return jsonify(get_dns_records(normalized_domain))
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/headers/<path:domain>")
def headers(domain):
    try:
        normalized_domain = normalize_domain_target(domain)
        return jsonify(analyze_headers(normalized_domain))
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/recon", methods=["GET"])
def recon():
    domain = request.args.get("domain")

    if not domain:
        return jsonify({"error": "Domain is required"}), 400

    try:
        normalized_domain = normalize_domain_target(domain)
        return jsonify({
            "domain": normalized_domain,
            "ip": get_ip(normalized_domain),
            "dns": get_dns_records(normalized_domain),
            "headers": analyze_headers(normalized_domain)
        })
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------
# SSLGuard – SSL/TLS ANALYSIS
# -----------------------------
@app.route("/ssl/<path:domain>")
def ssl_guard(domain):
    try:
        normalized_domain = normalize_domain_target(domain)
        return jsonify(analyze_ssl(normalized_domain))
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------
# URLInspector – URL RISK ANALYSIS
# -----------------------------
@app.route("/urlinspect", methods=["GET", "POST"])
def url_inspector():
    if request.method == "POST":
        payload = request.get_json(silent=True) or {}
        url = payload.get("url")
    else:
        url = request.args.get("url")

    if not url:
        return jsonify({"error": "URL is required"}), 400

    try:
        normalized_url = normalize_url_target(url)
        return jsonify(inspect_url(normalized_url))
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------
# SERVE REACT FRONTEND
# -----------------------------
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    file_path = os.path.join(app.static_folder, path)

    if path != "" and os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


# -----------------------------
# APP ENTRY POINT
# -----------------------------
if __name__ == "__main__":
    app.run(debug=True)
