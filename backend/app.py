"""
PCOS Prediction API
-------------------
Routes:
  POST /predict  — Accepts raw form values, normalises them, runs the ML model,
                   calls Gemini for personalised advice, and returns the full result.
  GET  /         — Health check.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS

from predict import predict_pcos

app = Flask(__name__)

# Allow requests from your React dev server (adjust origins in production)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000"])


# ─────────────────────────────────────────────────────────────
# Health check
# ─────────────────────────────────────────────────────────────
@app.route("/")
def home():
    return jsonify({"status": "ok", "message": "PCOS Prediction API is running."})


# ─────────────────────────────────────────────────────────────
# Prediction endpoint
# ─────────────────────────────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict():
    """
    Expected JSON body (raw, un-normalised values from the form):
    {
        "age":        <int>    — 10–60
        "weight":     <float>  — kg, 25–200
        "height":     <float>  — cm, 100–220
        "cycleLen":   <int>    — days, 15–60
        "symptoms": {
            "weightGain": <bool>,
            "facialHair": <bool>,
            "skinDark":   <bool>,
            "hairLoss":   <bool>,
            "acne":       <bool>
        },
        "fastFood":   <bool>,
        "exercise":   <bool>
    }
    """
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({"status": "error", "message": "No JSON body received."}), 400

        result = predict_pcos(data)
        return jsonify({"status": "success", "data": result})

    except ValueError as e:
        return jsonify({"status": "error", "message": str(e)}), 422
    except Exception as e:
        return jsonify({"status": "error", "message": f"Server error: {str(e)}"}), 500


# ─────────────────────────────────────────────────────────────
# Entry point
# ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, port=5000)