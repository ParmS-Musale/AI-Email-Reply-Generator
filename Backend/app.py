from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import cohere
from dotenv import load_dotenv

load_dotenv()




# Initialize Cohere API
co = cohere.Client(os.getenv("COHERE_API_KEY"))
frontendUrl = os.getenv("FRONTED_URL")

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", frontendUrl])

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

#  route
@app.route('/', methods=['GET'])
def hello():
    return jsonify({"message": "Hello, World!"})


# # Run app
# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000)

if __name__ == "__main__":
    # Use host="0.0.0.0" to make sure the app is publicly available
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))