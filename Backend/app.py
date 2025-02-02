from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import cohere
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow frontend requests

# Initialize Cohere API
co = cohere.Client(os.getenv("COHERE_API_KEY"))

# Database setup
def init_db():
    conn = sqlite3.connect("email_replies.db")
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS email_replies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            original_email TEXT NOT NULL,
            ai_reply TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# Generate AI reply
@app.route("/generate-reply", methods=["POST"])
def generate_reply():
    data = request.json
    email_content = data.get("email")

    if not email_content:
        return jsonify({"error": "Email content is required"}), 400

    prompt = f"Write a professional reply to the following email:\n\n{email_content}"
    response = co.generate(model="command", prompt=prompt, max_tokens=200)
    ai_reply = response.generations[0].text.strip()

    return jsonify({"reply": ai_reply})

# Run app
if __name__ == "__main__":
    init_db()
    app.run(debug=True)
