from flask import Flask, jsonify, request, send_from_directory, render_template
from flask_cors import CORS  # <-- import CORS
from recon.ip_lookup import get_ip
from recon.dns_lookup import get_dns_records
from recon.headers_check import analyze_headers
import os
from flask_cors import CORS


app = Flask(__name__, static_folder="frontend/recon-buddy-main/dist", template_folder="frontend/recon-buddy-main/dist")
CORS(app)  # <-- enable CORS for dev

@app.after_request
def add_ngrok_header(response):
    response.headers["ngrok-skip-browser-warning"] = "true"
    return response

# API routes
@app.route("/ip/<domain>")
def ip_lookup(domain):
    ip = get_ip(domain)
    return {"domain": domain, "ip": ip}

@app.route("/dns/<domain>")
def dns_lookup(domain):
    data = get_dns_records(domain)
    return data

@app.route("/headers/<domain>")
def headers(domain):
    report = analyze_headers(domain)
    return report

@app.route("/recon", methods=["GET"])
def recon():
    domain = request.args.get("domain")
    if not domain:
        return jsonify({"error": "Domain is required"})
    result = {
        "domain": domain,
        "ip": get_ip(domain),
        "dns": get_dns_records(domain),
        "headers": analyze_headers(domain)
    }
    return jsonify(result)

# Serve React frontend in production
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(debug=True)