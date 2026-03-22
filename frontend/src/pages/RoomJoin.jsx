import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const parseMembers = (search) => {
  try {
    const params = new URLSearchParams(search);
    const encoded = params.get("members");
    if (!encoded) return [];
    return JSON.parse(atob(encoded)) || [];
  } catch (err) {
    return [];
  }
};

const RoomJoin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const roomCode = params.get("circle") || "";
  const roomName = params.get("circleName") || "";

  const [members, setMembers] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    const list = parseMembers(location.search);
    setMembers(list);
    const stored = localStorage.getItem(`circleIdentity_${roomCode}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setSelectedId(parsed.id);
    }
  }, [location.search, roomCode]);

  const handleContinue = () => {
    const member = members.find((m) => m.id === selectedId);
    if (!member) return;
    localStorage.setItem(`circleIdentity_${roomCode}`, JSON.stringify(member));
    navigate(`/circle/dashboard${location.search}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-8 shadow-2xl space-y-2">
          <p className="text-indigo-100 text-sm uppercase tracking-wider">Join Circle</p>
          <h1 className="text-3xl font-bold">{roomName || "Circle"}</h1>
          <p className="text-indigo-100">Code: {roomCode}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-semibold">Pick your name</h2>
          {members.length === 0 ? (
            <p className="text-slate-400 text-sm">No member names found in the link.</p>
          ) : (
            <div className="space-y-2">
              {members.map((m) => (
                <label key={m.id} className="flex items-center justify-between bg-slate-800 rounded-lg px-3 py-2 border border-slate-700 cursor-pointer">
                  <span>{m.name}</span>
                  <input
                    type="radio"
                    name="identity"
                    checked={selectedId === m.id}
                    onChange={() => setSelectedId(m.id)}
                  />
                </label>
              ))}
            </div>
          )}
          <button
            onClick={handleContinue}
            disabled={!selectedId}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomJoin;
            