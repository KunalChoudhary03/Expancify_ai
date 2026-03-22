import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const encodeMembers = (members) => btoa(JSON.stringify(members));

const RoomCreate = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState([]); // {id,name}
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [initialized, setInitialized] = useState(false);

  const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  useEffect(() => {
    const saved = localStorage.getItem("circleDraft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRoomName(parsed.roomName || "");
        setRoomCode(parsed.roomCode || generateCode());
        setMembers(Array.isArray(parsed.members) ? parsed.members : []);
      } catch (err) {
        setRoomCode(generateCode());
      }
    } else {
      setRoomCode(generateCode());
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem(
      "circleDraft",
      JSON.stringify({ roomName, roomCode, members })
    );
  }, [initialized, roomName, roomCode, members]);

  const addMember = () => {
    const name = memberInput.trim();
    if (!name) return;
    const id = `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
    setMembers((prev) => [...prev, { id, name }]);
    setMemberInput("");
  };

  const removeMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const shareLink = useMemo(() => {
    const params = new URLSearchParams();
    params.set("circle", roomCode);
    if (roomName) params.set("circleName", roomName);
    if (members.length) params.set("members", encodeMembers(members));
    return `${window.location.origin}/circle/join?${params.toString()}`;
  }, [roomCode, roomName, members]);

  const syncRoom = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to create a circle");
        navigate("/login");
        return false;
      }

      await axios.post(
        "http://localhost:3000/api/circle/create",
        {
          roomCode,
          roomName,
          members,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Circle saved");
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create circle");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const goToJoin = async () => {
    const ok = await syncRoom();
    if (ok) navigate(`/circle/join?${shareLink.split("?")[1]}`);
  };

  const resetRoom = () => {
    setRoomName("");
    setRoomCode(generateCode());
    setMembers([]);
    setMemberInput("");
    setError("");
    setSuccess("");
    localStorage.removeItem("circleDraft");
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`Circle: ${roomName || roomCode}\nJoin: ${shareLink}`)}`;

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-6 py-5 flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-xs uppercase tracking-[0.12em]">Create a circle</p>
              <h1 className="text-2xl font-bold">Split faster with one invite</h1>
            </div>
            <span className="text-sm bg-white/20 border border-white/30 rounded-full px-3 py-1">Code: {roomCode}</span>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Step 1 · Circle name</p>
              <input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="e.g. Goa Trip 2026"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-3 text-base focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-3">
              <p className="text-sm text-slate-400">Step 2 · Add people</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  placeholder="Name (e.g. Rahul)"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-3 text-base focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={addMember}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-semibold"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {members.length === 0 && <p className="text-slate-500 text-sm">No names yet.</p>}
                {members.map((m) => (
                  <span key={m.id} className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1 text-sm">
                    {m.name}
                    <button onClick={() => removeMember(m.id)} className="text-slate-400 hover:text-red-400">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-slate-400">Step 3 · Continue</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={goToJoin}
                  className="flex-1 bg-white/10 border border-white/20 text-white font-semibold px-5 py-3 rounded-xl hover:bg-white/15 transition"
                >
                  Continue to select names
                </button>
                <button
                  onClick={resetRoom}
                  className="bg-slate-800 border border-slate-700 text-white font-semibold px-5 py-3 rounded-xl"
                >
                  Start fresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500 text-red-200">{error}</div>}
        {success && <div className="p-4 rounded-xl bg-green-500/10 border border-green-500 text-green-200">{success}</div>}
      </div>
    </div>
  );
};

export default RoomCreate;
