from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import cohere
from dotenv import load_dotenv
import datetime

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
            category TEXT,
            tone TEXT,
            language TEXT,
            timestamp TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Email categorization
categories = ["work", "personal", "spam", "urgent", "other"]
def categorize_email(email_content):
    prompt = f"Classify this email into one of the following categories: {categories}.\nEmail: {email_content}\nCategory:"
    response = co.generate(model="command", prompt=prompt, max_tokens=5)
    return response.generations[0].text.strip()

# Generate AI reply with tone and language options
@app.route("/generate-reply", methods=["POST"])
def generate_reply():
    data = request.json
    email_content = data.get("email")
    tone = data.get("tone", "formal")  # Default to formal
    language = data.get("language", "en")  # Default to English
    
    if not email_content:
        return jsonify({"error": "Email content is required"}), 400

    # Categorize email
    category = categorize_email(email_content)
    
    prompt = f"""
    You are an AI that generates professional email replies.
    Ensure the response is polite, structured, and follows the selected tone and language.
    
    ### Given Email:
    {email_content}
    
    ### Reply Tone: {tone}
    ### Language: {language}
    
    ### AI-Generated Reply:
    """
    response = co.generate(model="command", prompt=prompt, max_tokens=200)
    ai_reply = response.generations[0].text.strip()

    # Save to database
    conn = sqlite3.connect("email_replies.db")
    cursor = conn.cursor()
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("INSERT INTO email_replies (original_email, ai_reply, category, tone, language, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
                   (email_content, ai_reply, category, tone, language, timestamp))
    conn.commit()
    conn.close()

    return jsonify({"reply": ai_reply, "category": category})

# Fetch past replies (for email thread handling & analytics)
@app.route("/past-replies", methods=["GET"])
def get_past_replies():
    conn = sqlite3.connect("email_replies.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM email_replies ORDER BY timestamp DESC LIMIT 10")
    replies = cursor.fetchall()
    conn.close()
    
    return jsonify({"past_replies": replies})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
