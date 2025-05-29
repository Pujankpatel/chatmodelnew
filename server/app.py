from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

OLLAMA_API_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "gemma3:4b"  # change this to "mistral", "gemma", etc. if needed

@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_message = request.json.get("message", "")

        payload = {
            "model": OLLAMA_MODEL,
            "prompt": user_message,
            "stream": False
        }

        response = requests.post(OLLAMA_API_URL, json=payload)
        response.raise_for_status()
        result = response.json()

        return jsonify({"response": result.get("response", "").strip()})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
