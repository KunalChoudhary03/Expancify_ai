import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const encodeMembers = (members) => btoa(JSON.stringify(members || []));
const buildShareLink = (room) => {
  const params = new URLSearchParams();
  params.set("circle", room.code);
  if (room.name) params.set("circleName", room.name);
  if (room.members?.length) params.set("members", encodeMembers(room.members));
  return `${window.location.origin}/circle/join?${params.toString()}`;
};
const buildWhatsAppHref = (room) => {
  const link = buildShareLink(room);
  return `https://wa.me/?text=${encodeURIComponent(`Circle: ${room.name || room.code}\nJoin: ${link}`)}`;
};

const RoomList = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingCode, setEditingCode] = useState("");
  const [editingName, setEditingName] = useState("");
  const [editingMembers, setEditingMembers] = useState([]);
  const [memberInput, setMemberInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingCode, setDeletingCode] = useState("");

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await axios.get("http://localhost:3000/api/circle", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(res.data.rooms || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load circles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const startEdit = (room) => {
    setEditingCode(room.code);
    setEditingName(room.name || "");
    setEditingMembers(room.members || []);
    setMemberInput("");
  };

  const cancelEdit = () => {
    setEditingCode("");
    setEditingName("");
    setEditingMembers([]);
    setMemberInput("");
    setSaving(false);
  };

  const addMember = () => {
    const name = memberInput.trim();
    if (!name) return;
    const id = `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
    setEditingMembers((prev) => [...prev, { id, name }]);
    setMemberInput("");
  };

  const removeMember = (id) => {
    setEditingMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const saveEdit = async () => {
    try {
      setSaving(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.put(
        `http://localhost:3000/api/circle/${editingCode}`,
        {
          roomName: editingName,
          members: editingMembers,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      cancelEdit();
      fetchRooms();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update circle");
    } finally {
      setSaving(false);
    }
  };

  const deleteRoom = async (code) => {
    const confirmDelete = window.confirm("Delete this circle and its expenses?");
    if (!confirmDelete) return;
    try {
      setDeletingCode(code);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      await axios.delete(`http://localhost:3000/api/circle/${code}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (editingCode === code) cancelEdit();
      fetchRooms();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete circle");
    } finally {
      setDeletingCode("");
    }
  };

  const goToRoom = (room) => {
    const params = new URLSearchParams();
    params.set("circle", room.code);
    if (room.name) params.set("circleName", room.name);
    if (room.members?.length) params.set("members", encodeMembers(room.members));
    navigate(`/circle/dashboard?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-indigo-100 text-sm uppercase tracking-wider">My Circles</p>
            <h1 className="text-3xl font-bold">Circles you created</h1>
            <p className="text-indigo-100 text-sm">Total: {rooms.length}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchRooms} className="bg-white/15 border border-white/30 text-white px-4 py-2 rounded-xl hover:bg-white/25">Refresh</button>
            <button onClick={() => navigate("/circle/create")} className="bg-white text-indigo-700 px-4 py-2 rounded-xl font-semibold shadow hover:-translate-y-0.5 transition">New circle</button>
          </div>
        </div>

        {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500 text-red-200">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 text-slate-300">Loading circles…</div>
          ) : rooms.length === 0 ? (
            <div className="col-span-2 text-slate-400 text-sm bg-slate-900 border border-slate-800 rounded-2xl p-6">No circles yet. Create one to see it here.</div>
          ) : (
            rooms.map((room) => (
              <div
                key={room._id || room.code}
                className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl"
              >
                {editingCode === room.code ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">Circle code: {room.code}</p>
                        <input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                          placeholder="Circle name"
                        />
                      </div>
                      <span className="text-xs text-slate-500">{editingMembers.length} members</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        value={memberInput}
                        onChange={(e) => setMemberInput(e.target.value)}
                        placeholder="Add member name"
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                      />
                      <button onClick={addMember} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold">Add</button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {editingMembers.length === 0 && <p className="text-slate-500 text-sm">No members yet.</p>}
                      {editingMembers.map((m) => (
                        <span key={m.id} className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1 text-sm">
                          {m.name}
                          <button onClick={() => removeMember(m.id)} className="text-slate-400 hover:text-red-400">×</button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={saveEdit}
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-60"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button onClick={cancelEdit} className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg">Cancel</button>
                      <button
                        onClick={() => deleteRoom(room.code)}
                        disabled={deletingCode === room.code}
                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-60"
                      >
                        {deletingCode === room.code ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">Circle code: {room.code}</p>
                        <h3 className="text-xl font-semibold">{room.name || "Untitled circle"}</h3>
                      </div>
                      <span className="text-xs text-slate-500">{room.members?.length || 0} members</span>
                    </div>
                    <p className="text-slate-500 text-sm">Created {room.createdAt ? new Date(room.createdAt).toLocaleString() : "recently"}</p>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => goToRoom(room)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold">Open</button>
                      <button onClick={() => startEdit(room)} className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg">Edit</button>
                      <a
                        href={buildWhatsAppHref(room)}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold text-center"
                      >
                        Share
                      </a>
                      <button
                        onClick={() => deleteRoom(room.code)}
                        disabled={deletingCode === room.code}
                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-60"
                      >
                        {deletingCode === room.code ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomList;
