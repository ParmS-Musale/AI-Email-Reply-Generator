 # 📧 AI Email Reply Generator

An AI-powered email reply generator that automates professional responses. It categorizes emails, customizes reply tones, supports multiple languages, and maintains email thread context. Built with **Python (backend)** and **React (frontend)**.

## 🚀 Features

### Backend Features (Python, SQLite, Cohere API)
✅ **AI-Powered Email Replies** – Generates professional responses using Cohere API.  


### Frontend Features (React, Vite, Tailwind CSS)
✅ ** Deligate UI** – Enhances UI aesthetics .  

---

## 🛠️ Tech Stack

### Backend:
- **Python** – Core backend logic.
- **Flask/FastAPI** – API framework.
- **SQLite** – Database for storing emails and replies.
- **Cohere API** – AI model for email reply generation.


### Frontend:
- **React (Vite)** – Modern frontend framework.
- **Tailwind CSS** – Styling and responsive design.
- **Axios** – API requests.

---

## ⚙️ Installation & Setup

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/ai-email-reply-generator.git
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # (Linux/macOS)
venv\Scripts\activate    # (Windows)

# Install dependencies
pip install -r requirements.txt

# Set up environment variables (create .env file)
COHERE_API_KEY=your_cohere_api_key
DATABASE_URL=sqlite:///emails.db

# Run the backend
python app.py  # Or use uvicorn for FastAPI
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## 📌 API Endpoints

| Method | Endpoint          | Description |
|--------|------------------|-------------|
| POST   | `/api/reply`     | Generate an AI-powered email reply |


---

## Contributing
Contributions are welcome! Feel free to fork the repo, submit issues, or open pull requests.

---

## 📜 License
This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contact
For any questions, reach out at [musaleparm9541@gmail.com](mailto:musaleparm9541@gmail.com) or open an issue in the GitHub repository.

---

### 🚀 Happy Coding! 🎉
