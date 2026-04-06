import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

const REPORT_STORAGE_KEY_PREFIX = "dashboard_ai_report";

const Dashboard = () => {
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportScope, setReportScope] = useState("personal");
  const [rooms, setRooms] = useState([]);
  const [selectedRoomCode, setSelectedRoomCode] = useState("");
  const navigate = useNavigate();

  const getReportStorageKey = (scope, roomCode = "") => {
    if (scope === "room" && roomCode) {
      return `${REPORT_STORAGE_KEY_PREFIX}_room_${roomCode}`;
    }
    return `${REPORT_STORAGE_KEY_PREFIX}_personal`;
  };

  useEffect(() => {
    const savedReport = localStorage.getItem(getReportStorageKey(reportScope, selectedRoomCode));
    if (savedReport) {
      setAiResponse(savedReport);
      setError("");
      return;
    }

    setAiResponse("");
  }, [reportScope, selectedRoomCode]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          return;
        }

        const response = await axios.get(`${API_URL}/api/circle`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedRooms = response.data.rooms || [];
        setRooms(fetchedRooms);

        if (fetchedRooms.length > 0) {
          setSelectedRoomCode((prev) => prev || fetchedRooms[0].code || "");
        }
      } catch {
        setRooms([]);
      }
    };

    fetchRooms();
  }, []);

  const generateAIAnalysis = async () => {
    try {
      setLoading(true);
      setError("");
      setAiResponse("");

      const token = localStorage.getItem("token");

      // ✅ If not logged in
      if (!token) {
        navigate("/login");
        return;
      }

      if (reportScope === "room" && !selectedRoomCode) {
        setError("Please select a room first");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/ai/generate`,
        reportScope === "room" ? { roomCode: selectedRoomCode } : {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Safe response handling
      if (response.data && response.data.response) {
        setAiResponse(response.data.response);
        localStorage.setItem(
          getReportStorageKey(reportScope, selectedRoomCode),
          response.data.response
        );
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to generate AI analysis";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Format AI Text Output
  const formatResponse = (text) => {
    if (!text) return null;

    const lines = text.split("\n");
    let isUnnecessarySection = false;

    return lines.map((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine.includes("===")) {
        isUnnecessarySection = false;
        return (
          <h2
            key={index}
            className="text-2xl font-bold text-indigo-400 mb-6 text-center py-2"
          >
            {trimmedLine.replace(/=/g, "").trim()}
          </h2>
        );
      }

      if (
        trimmedLine.endsWith(":") &&
        trimmedLine.length < 50
      ) {
        isUnnecessarySection = trimmedLine.includes("Unnecessary");
        
        const isUnnecessary = trimmedLine.includes("Unnecessary");
        const headingColor = isUnnecessary ? "text-red-400" : "text-indigo-300";
        const bgColor = isUnnecessary ? "bg-red-950/30" : "";
        
        return (
          <h3
            key={index}
            className={`text-lg font-semibold ${headingColor} mt-6 mb-3 py-2 px-3 rounded ${bgColor}`}
          >
            {isUnnecessary ? "⚠️ " : ""}{trimmedLine}
          </h3>
        );
      }

      if (
        (trimmedLine.startsWith("-") || trimmedLine.startsWith("•") || trimmedLine.startsWith("*")) &&
        trimmedLine.length > 1
      ) {
        const content = trimmedLine.substring(1).trim();
        
        if (isUnnecessarySection) {
          return (
            <div key={index} className="bg-red-900/20 border-l-4 border-red-500 pl-4 py-2 mb-2 rounded">
              <p className="text-red-300 font-medium">
                🔴 {content}
              </p>
            </div>
          );
        }
        
        return (
          <li key={index} className="text-gray-300 ml-6 list-disc">
            {content}
          </li>
        );
      }

      // Content after colon
      if (trimmedLine.includes(":") && !trimmedLine.endsWith(":")) {
        const [label, content] = trimmedLine.split(":").map(s => s.trim());
        return (
          <div key={index} className="mb-2">
            <span className="font-semibold text-indigo-300">{label}:</span>
            <span className="text-gray-300 ml-2">{content}</span>
          </div>
        );
      }

      if (trimmedLine) {
        return (
          <p key={index} className="text-gray-300 mb-2 leading-relaxed">
            {trimmedLine}
          </p>
        );
      }

      return null;
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top duration-500">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-indigo-400 mb-4 transition text-2xl"
          >
            ←
          </button>

          <h1 className="text-4xl font-bold text-white mb-2">
            AI Financial Insights
          </h1>
          <p className="text-gray-400">
            Get smart analysis & suggestions for your expenses
          </p>
        </div>

        {/* Generate Button */}
        <div className="mt-6 mb-4 bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Report Type</label>
              <select
                value={reportScope}
                onChange={(e) => setReportScope(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="personal">My Added Expenses</option>
                <option value="room">Particular Room Expenses</option>
              </select>
            </div>

            {reportScope === "room" && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Select Room</label>
                <select
                  value={selectedRoomCode}
                  onChange={(e) => setSelectedRoomCode(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                >
                  {rooms.length === 0 && <option value="">No rooms available</option>}
                  {rooms.map((room) => (
                    <option key={room._id || room.code} value={room.code}>
                      {room.name || room.code}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={generateAIAnalysis}
          disabled={loading}
          className="w-full bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-indigo-500/50 hover:scale-105"
        >
          {loading
            ? "⏳ Analyzing your expenses..."
            : reportScope === "room"
              ? "✨ Generate Room AI Analysis"
              : "✨ Generate AI Analysis"}
        </button>

        {/* Error */}
        {error && (
          <div className="app-alert app-alert-error mt-6 animate-in fade-in slide-in-from-top" role="alert">
            {error}
          </div>
        )}

        {/* AI Response */}
        {aiResponse && (
          <div className="mt-8 bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom duration-500">
            <div className="space-y-2">
              {formatResponse(aiResponse)}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!aiResponse && !loading && !error && (
          <div className="mt-8 bg-gray-800 border border-gray-700 rounded-2xl p-12 text-center animate-in fade-in duration-500 delay-200">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No Analysis Yet
            </h3>
            <p className="text-gray-500">
              Click the button above to generate AI-powered insights
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;