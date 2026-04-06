import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";

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

const joinedCirclesKey = "joinedCirclesRegistry";

const saveJoinedCircle = (roomCode, roomName, members, selectedMember) => {
  try {
    const existing = JSON.parse(localStorage.getItem(joinedCirclesKey) || "[]");
    const next = Array.isArray(existing) ? existing.filter((room) => room?.code !== roomCode) : [];
    next.unshift({
      code: roomCode,
      name: roomName || roomCode,
      members: members || [],
      selectedMember,
      joinedAt: new Date().toISOString(),
    });
    localStorage.setItem(joinedCirclesKey, JSON.stringify(next));
  } catch (err) {
    console.error("Failed to save joined circle", err);
  }
};

const RoomDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const roomCode = params.get("circle") || "";
  const roomName = params.get("circleName") || "";

  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState([]);
  const [loadingExpense, setLoadingExpense] = useState(false);
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [balances, setBalances] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [totalSpentAll, setTotalSpentAll] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("expenses");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editDate, setEditDate] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);

  useEffect(() => {
    const memberList = parseMembers(location.search);
    setMembers(memberList);
    setParticipants(memberList.map((m) => m.id));

    const stored = localStorage.getItem(`circleIdentity_${roomCode}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setSelectedMemberId(parsed.id);
    } else if (memberList[0]) {
      setSelectedMemberId(memberList[0].id);
    }

    if (roomCode && memberList.length) {
      const selectedMember = stored ? JSON.parse(stored) : memberList[0] || null;
      saveJoinedCircle(roomCode, roomName, memberList, selectedMember);
    }
  }, [location.search, roomCode]);

  useEffect(() => {
    if (members.length === 0) return;
    ensureRoom();
  }, [location.search, members, roomCode]);

  const formattedName = (item) => item?.name || item?.username || "User";

  const toggleParticipant = (id) => {
    setParticipants((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const ensureRoom = async () => {
    try {
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      if (!roomCode) {
        setError("Circle code missing");
        return;
      }

      const selectedMember = members.find((m) => m.id === selectedMemberId) || null;

      await axios.post(
        `${API_URL}/api/circle/create`,
        {
          roomCode,
          roomName,
          members,
          selectedMemberId,
          selectedMemberName: selectedMember?.name || "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchBalances();
    } catch (err) {
      setError(err.response?.data?.message || "Circle not found");
    }
  };

  const handleAddExpense = async () => {
    try {
      setError("");
      setSuccess("");
      setLoadingExpense(true);

      if (!title || !amount || !selectedMemberId || participants.length === 0) {
        setError("Fill all fields and select people");
        setLoadingExpense(false);
        return;
      }

      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/circle/${roomCode}/expense`,
        {
          title,
          amount,
          paidBy: selectedMemberId,
          participants,
          date,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Expense added");
      setTitle("");
      setAmount("");
      setDate("");
      fetchBalances();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add expense");
    } finally {
      setLoadingExpense(false);
    }
  };

  const fetchBalances = async () => {
    try {
      setLoadingBalances(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/circle/${roomCode}/balances`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalances((res.data.balances || []).map((b) => ({ userId: b.id, net: b.net, name: b.name })));
      setSuggested((res.data.settlementsSuggested || []).map((s) => ({ fromUser: s.fromId, toUser: s.toId, amount: s.amount })));
      setTotalSpentAll(res.data.totalSpentAll || 0);
      setExpenses(res.data.expenses || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load balances");
    } finally {
      setLoadingBalances(false);
    }
  };

  const formatCurrency = (val) => `₹${Math.abs(Number(val || 0)).toLocaleString()}`;

  const handleEditExpense = async (expId) => {
    try {
      setError("");
      setSuccess("");
      
      if (!editTitle || !editAmount) {
        setError("Title and amount are required");
        return;
      }

      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/circle/${roomCode}/expense/${expId}`,
        {
          title: editTitle,
          amount: editAmount,
          date: editDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Expense updated");
      setEditingId(null);
      fetchBalances();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update expense");
    }
  };

  const handleDeleteExpense = async (expId) => {
    if (!window.confirm("Delete this expense?")) return;
    
    try {
      setError("");
      setSuccess("");
      setMenuOpen(null);
      
      const token = localStorage.getItem("token");
      console.log("Deleting expense:", expId, "from room:", roomCode);
      
      const response = await axios.delete(
        `${API_URL}/api/circle/${roomCode}/expense/${expId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Delete response:", response.data);
      setSuccess("Expense deleted");
      fetchBalances();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.message || "Failed to delete expense");
    }
  };

  const openEditModal = (exp) => {
    setEditingId(exp.id);
    setEditTitle(exp.title);
    setEditAmount(exp.amount);
    setEditDate(exp.date ? exp.date.split("T")[0] : "");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {error && <div className="app-alert app-alert-error" role="alert">{error}</div>}
        {success && <div className="app-alert app-alert-success" role="status">{success}</div>}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Circle</p>
              <h1 className="text-2xl font-bold">{roomName || roomCode || "Circle"}</h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="bg-slate-800/70 border border-slate-700 rounded-full px-3 py-1">Code: {roomCode || "-"}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            {[
              { key: "expenses", label: "Expenses" },
              { key: "balances", label: "Balances" },
              { key: "add", label: "Add expense" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={
                  "rounded-xl py-2 font-semibold border transition " +
                  (activeTab === tab.key
                    ? "bg-white text-gray-900 border-white"
                    : "bg-slate-900 border-slate-700 text-slate-200 hover:border-indigo-500")
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "add" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Expense form</p>
              <h2 className="text-xl font-semibold">Add expense in this circle</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-4 space-y-2">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Step 1</p>
                <label className="text-sm text-slate-200 font-semibold">Who are you?</label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => {
                    setSelectedMemberId(e.target.value);
                    const member = members.find((m) => m.id === e.target.value);
                    if (member) localStorage.setItem(`circleIdentity_${roomCode}`, JSON.stringify(member));
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select yourself</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Step 2</p>
                    <label className="text-sm text-slate-200 font-semibold">Expense details</label>
                  </div>
                  <span className="text-[11px] text-slate-400">All fields required</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">Title</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
                      placeholder="Groceries, cab, lunch..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Amount (INR)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Step 3</p>
                    <label className="text-sm text-slate-200 font-semibold">Split with</label>
                  </div>
                  <span className="text-[11px] text-slate-400">{participants.length} selected</span>
                </div>
                <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
                  {members.map((m) => (
                    <label key={m.id} className="flex items-center justify-between bg-slate-900 rounded-xl px-3 py-2 border border-slate-700 cursor-pointer">
                      <span>{m.name}</span>
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={participants.includes(m.id)}
                        onChange={() => toggleParticipant(m.id)}
                      />
                    </label>
                  ))}
                  {members.length === 0 && <p className="text-slate-500 text-sm">No members in this circle.</p>}
                </div>

                <button
                  onClick={handleAddExpense}
                  disabled={loadingExpense}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold disabled:opacity-60"
                >
                  {loadingExpense ? "Adding..." : "Submit expense"}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "expenses" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Expenses</h3>
                <p className="text-slate-400 text-sm">Total spent: {formatCurrency(totalSpentAll)}</p>
              </div>
              <button onClick={fetchBalances} className="text-sm px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 hover:border-indigo-500">Refresh</button>
            </div>

            {loadingBalances ? (
              <p className="text-slate-400 text-sm">Loading…</p>
            ) : expenses.length === 0 ? (
              <p className="text-slate-500 text-sm">No expenses yet. Add one above.</p>
            ) : (
              <div className="space-y-3">
                {expenses.map((exp) => {
                  const participantCount = exp.participants?.length || 0;
                  const share = participantCount ? Number(exp.amount) / participantCount : Number(exp.amount || 0);
                  const youInvolved = selectedMemberId && exp.participants?.includes(selectedMemberId);
                  const youPaid = selectedMemberId && exp.paidBy === selectedMemberId;
                  const yourNet = youInvolved ? (youPaid ? Number(exp.amount) - share : -share) : 0;
                  const dateLabel = exp.date ? new Date(exp.date).toLocaleDateString() : "";
                  return (
                    <div key={exp.id || `${exp.title}-${exp.paidBy}-${exp.amount}`} className="bg-slate-800 rounded-xl border border-slate-700 px-4 py-3 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-base">{exp.title}</p>
                          <p className="text-xs text-slate-400">Paid by {exp.paidByName || exp.paidBy}{dateLabel ? ` · ${dateLabel}` : ""}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">{formatCurrency(exp.amount)}</p>
                          <p className="text-xs text-slate-400">Split among {participantCount} people</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(exp.participantNames || exp.participants || []).map((nameOrId, idx) => (
                          <span key={`${exp.id || idx}-${nameOrId}`} className="text-xs bg-slate-900 border border-slate-700 rounded-full px-3 py-1 text-slate-200">
                            {exp.participantNames ? nameOrId : nameOrId}
                          </span>
                        ))}
                      </div>

                      {youInvolved && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Your share: {formatCurrency(share)}</span>
                          <span className={yourNet >= 0 ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                            {yourNet >= 0 ? "+" : "-"}{formatCurrency(Math.abs(yourNet))}
                          </span>
                        </div>
                      )}

                      {editingId === exp.id ? (
                        <div className="bg-slate-900 rounded-lg p-3 space-y-2 mt-3">
                          <input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Title"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                          />
                          <input
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            placeholder="Amount"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                          />
                          <input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditExpense(exp.id)}
                              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm font-semibold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => { setEditingId(null); setMenuOpen(null); }}
                              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm font-semibold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end relative">
                          <button
                            onClick={() => setMenuOpen(menuOpen === exp.id ? null : exp.id)}
                            className="text-xl px-2 py-1 text-slate-400 hover:text-indigo-400 transition"
                          >
                            ⋮
                          </button>
                          {menuOpen === exp.id && (
                            <div className="absolute right-0 top-8 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10 min-w-max">
                              <button
                                onClick={() => { openEditModal(exp); setMenuOpen(null); }}
                                className="block w-full text-left px-4 py-2 text-sm text-blue-400 hover:bg-slate-700 first:rounded-t-lg"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDeleteExpense(exp.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 last:rounded-b-lg"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "balances" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Balances</h3>
                <p className="text-slate-400 text-sm">Net per person</p>
              </div>
              <button onClick={fetchBalances} className="text-sm px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 hover:border-indigo-500">Refresh</button>
            </div>
            {loadingBalances ? (
              <p className="text-slate-400 text-sm">Loading…</p>
            ) : balances.length === 0 ? (
              <p className="text-slate-500 text-sm">No balances yet.</p>
            ) : (
              <div className="space-y-2">
                {balances.map((b) => {
                  const net = Number(b.net || 0);
                  const positive = net > 0;
                  const isSelf = b.userId === selectedMemberId;
                  return (
                    <div key={b.userId} className="bg-slate-800 rounded-xl border border-slate-700 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold text-white/90">
                          {formattedName(b).charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{formattedName(b)}</p>
                          {isSelf && <p className="text-xs text-indigo-200">Me</p>}
                        </div>
                      </div>
                      <span className={positive ? "text-emerald-400 font-semibold" : net < 0 ? "text-red-400 font-semibold" : "text-slate-300 font-semibold"}>
                        {positive ? "+" : net < 0 ? "-" : ""}{formatCurrency(net)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Suggested settlements</h4>
                <span className="text-xs text-slate-400">Auto</span>
              </div>
              {loadingBalances ? (
                <p className="text-slate-400 text-sm">Loading…</p>
              ) : suggested.length ? (
                <div className="space-y-2 text-sm">
                  {suggested.map((s, idx) => (
                    <div key={`${s.fromUser}-${s.toUser}-${idx}`} className="bg-slate-900 rounded-lg px-3 py-2 border border-slate-700 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{formattedName(balances.find((b) => b.userId === s.fromUser) || members.find((m) => m.id === s.fromUser))} → {formattedName(balances.find((b) => b.userId === s.toUser) || members.find((m) => m.id === s.toUser))}</p>
                        <p className="text-xs text-slate-400">Settle to clear dues</p>
                      </div>
                      <span className="text-indigo-200 font-semibold">₹{s.amount}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">All settled.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDashboard;
