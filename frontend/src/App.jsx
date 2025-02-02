import React, { useState } from "react";
import axios from "axios";
import Header from "./components/Header";

function App() {
  const [email, setEmail] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/generate-reply",
        { email }
      );
      setReply(response.data.reply);
    } catch (error) {
      console.error("Error generating reply:", error);
      setReply("Failed to generate reply. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-500 to-teal-500 p-8">
        <div className="max-w-4xl w-full p-6 bg-white rounded-xl shadow-2xl">
          <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">
            AI Email Reply Generator
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <textarea
                className="w-full border border-gray-300 p-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="6"
                placeholder="Paste the email content here..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Reply"}
              </button>
            </div>
          </form>

          {reply && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                AI-Generated Reply:
              </h2>
              <p className="text-gray-800">{reply}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
