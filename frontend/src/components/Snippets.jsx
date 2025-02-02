import React, { useState, useEffect, useRef } from "react";
import Loading from "./Loading";
import { backendUrl } from "../utils/constants";

const CodeSnippetDisplay = () => {
  const [taskData, setTaskData] = useState([]); // To store existing tasks from the API
  const [taskInput, setTaskInput] = useState(""); // To store user input for a new task
  const [chatHistory, setChatHistory] = useState([]); // To store the chat history (user input and generated code)
  const [isLoading, setIsLoading] = useState(false); // To show a loading indicator when generating code
  const chatEndRef = useRef(null);


  useEffect(() => {
    // Fetch existing tasks from the Flask API on initial load
    const fetchTaskData = async () => {
      try {
        const response = await fetch(backendUrl+"/get-tasks"); // Replace with your Flask server URL
        const data = await response.json();
        setTaskData(data); // Set the fetched data to the state
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTaskData();
  }, []); // Empty dependency array ensures it runs once when the component mounts

  const handleInputChange = (e) => {
    setTaskInput(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (taskInput.trim() === "") {
      return;
    }

    setChatHistory((prev) => [...prev, { type: "user", message: taskInput }]);
    setIsLoading(true);

    try {
      const response = await fetch(backendUrl+"/generate_code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: taskInput }),
      });

      const data = await response.json();

      if (data && data.code_snippet) {
        setChatHistory((prev) => [
          ...prev,
          { type: "system", message: data.code_snippet },
        ]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          { type: "system", message: "No code generated" },
        ]);
      }
    } catch (error) {
      console.error("Error generating code:", error);
      setChatHistory((prev) => [
        ...prev,
        { type: "system", message: "Error generating code" },
      ]);
    }

    setIsLoading(false);
    setTaskInput("");
  };
   useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);


  return (
    <div className="mx-auto bg-white rounded-lg shadow-lg mt-10 flex flex-col h-[92vh]">
      <div className="overflow-y-scroll">
        {/* Display Existing Tasks */}
        <div className="p-4 rounded-lg shadow-inner mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
           
          </h2>
          <div className="space-y-4 mt-4">
            {taskData.map((task, index) => (
              <div key={index} className="flex flex-col space-y-2">
                <div className="bg-white p-4 rounded-lg shadow-inner">
                  <h3 className="text-xl font-semibold text-gray-900">Task:</h3>
                  <p className="text-gray-700 text-lg">{task.task}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-inner">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Code Snippet:
                  </h4>
                  <pre className="bg-black text-white p-4 rounded-lg mt-2 overflow-x-auto">
                    {task.code_snippet}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat History: User and System responses */}
        <div className="flex-1 overflow-y-auto px-4 space-y-4 py-4 rounded-lg">
          {chatHistory.map((entry, index) => (
            <div
              key={index}
              className={`flex ${
                entry.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xl p-4 rounded-lg ${
                  entry.type === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                {entry.type === "user" ? (
                  <p>{entry.message}</p>
                ) : (
                  <pre className="bg-black text-white p-3 rounded-lg overflow-x-auto">
                    {entry.message}
                  </pre>
                )}
              </div>
            </div>
          ))}
          {/* Show loading indicator when isLoading is true */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-lg p-4 rounded-lg bg-gray-100 text-gray-900">
                <Loading/>

              </div>
            </div>
          )}
         <div ref={chatEndRef}></div>
        </div>
         {/* Empty div for scrolling */}
      </div>
      {/* Input Field for New Task */}
      <div className="p-4 border-t-2 border-gray-200">
        <form
          onSubmit={handleFormSubmit}
          className="flex items-center space-x-4"
        >
          <input
            type="text"
            value={taskInput}
            onChange={handleInputChange}
            className="flex-1 p-3 border border-gray-300 rounded-md"
            placeholder="Enter your task..."
          />
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-md"
            disabled={isLoading} // Optionally disable the button during loading
          >
            Generate Code
          </button>
        </form>
      </div>
    </div>
  );
};

export default CodeSnippetDisplay;