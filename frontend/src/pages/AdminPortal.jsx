import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminPortal = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [summaryError, setSummaryError] = useState("");
  const [spendSummary, setSpendSummary] = useState([]);
  const [totalSpentAll, setTotalSpentAll] = useState(0);

  useEffect(() => {
    fetchUsers();
    fetchSpendSummary();
  }, []);

  useEffect(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      setFilteredUsers(users);
      return;
    }

    const matches = users.filter((user) => {
      const fullName = `${user.fullName?.firstName || ""} ${user.fullName?.lastName || ""}`.toLowerCase();
      return (
        user.username?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        fullName.includes(query)
      );
    });

    setFilteredUsers(matches);
  }, [search, users]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to access the admin portal.");
        navigate("/login");
        return;
      }

      const res = await axios.get("http://localhost:3000/api/admin/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const list = res.data?.users || [];
      setUsers(list);
      setFilteredUsers(list);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load users";
      setError(message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchSpendSummary = async () => {
    try {
      setLoadingSummary(true);
      setSummaryError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setSummaryError("Please login to view spend summary.");
        navigate("/login");
        return;
      }

      const res = await axios.get("http://localhost:3000/api/admin/user/spend-summary", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSpendSummary(res.data?.totals || []);
      setTotalSpentAll(res.data?.totalSpentAll || 0);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load spend summary";
      setSummaryError(message);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setExpenses([]);
    setInfo("");
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to view expenses.");
      navigate("/login");
      return;
    }

    try {
      setLoadingExpenses(true);
      const res = await axios.get(
        `http://localhost:3000/api/admin/user/expense/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const list = res.data?.expenses || [];
      if (!list.length) {
        setInfo("No expenses found for this user.");
      }
      setExpenses(list);
    } catch (err) {
      if (err.response?.status === 404) {
        setInfo("No expenses found for this user.");
        setExpenses([]);
      } else {
        const message = err.response?.data?.message || "Failed to load expenses";
        setError(message);
      }
    } finally {
      setLoadingExpenses(false);
    }
  };

  const totalAmount = useMemo(() => {
    return expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [expenses]);

  const formattedName = (user) => {
    if (!user) return "";
    const first = user.fullName?.firstName || "";
    const last = user.fullName?.lastName || "";
    return `${first} ${last}`.trim() || user.username;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p
              onClick={() => navigate(-1)}
              className="text-sm text-slate-400 hover:text-indigo-300 cursor-pointer mb-2"
            >
              ← Back
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold">Admin Portal</h1>
            <p className="text-slate-400 mt-2">
              Monitor users, review expenses, and keep everything on track.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchUsers}
              className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-indigo-500 transition"
            >
              Refresh
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition"
            >
              AI Dashboard
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
            <p className="text-slate-400 text-sm">Total Users</p>
            <p className="text-3xl font-bold mt-1">{users.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
            <p className="text-slate-400 text-sm">Expenses (selected user)</p>
            <p className="text-3xl font-bold mt-1">{expenses.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
            <p className="text-slate-400 text-sm">Total Amount</p>
            <p className="text-3xl font-bold mt-1">₹{totalAmount.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
            <p className="text-slate-400 text-sm">Total Spend (all users)</p>
            <p className="text-3xl font-bold mt-1">₹{Number(totalSpentAll).toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Ranking by spend</p>
              <h2 className="text-xl font-semibold">Top Spenders</h2>
            </div>
            <button
              onClick={fetchSpendSummary}
              className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-indigo-500 text-sm"
            >
              Refresh
            </button>
          </div>

          {summaryError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500 text-red-200">
              {summaryError}
            </div>
          )}

          {loadingSummary ? (
            <p className="text-slate-400">Loading ranking…</p>
          ) : spendSummary.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800 text-slate-300">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Username</th>
                    <th className="px-4 py-3">Total Spent</th>
                    <th className="px-4 py-3">Entries</th>
                  </tr>
                </thead>
                <tbody>
                  {spendSummary.map((item, idx) => (
                    <tr key={item.userId} className="border-t border-slate-800 hover:bg-slate-800/50">
                      <td className="px-4 py-3 font-semibold">#{idx + 1}</td>
                      <td className="px-4 py-3">
                        {formattedName({ fullName: item.fullName, username: item.username })}
                        <div className="text-slate-400 text-xs">{item.email}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{item.username}</td>
                      <td className="px-4 py-3 text-indigo-200">₹{Number(item.totalSpent).toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate-300">{item.expenseCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-400">No spend data available.</p>
          )}
        </div>

        {(error || info) && (
          <div
            className={`p-4 rounded-2xl border ${
              error
                ? "bg-red-500/10 border-red-500 text-red-200"
                : "bg-indigo-500/10 border-indigo-500 text-indigo-200"
            }`}
          >
            {error || info}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, username, or email"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="h-[520px] overflow-y-auto space-y-3 pr-1">
              {loadingUsers ? (
                <p className="text-slate-400">Loading users…</p>
              ) : filteredUsers.length ? (
                filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className={`p-4 rounded-xl border transition cursor-pointer bg-slate-800/50 border-slate-800 hover:border-indigo-500 hover:bg-slate-800 ${
                      selectedUser?._id === user._id ? "border-indigo-500" : ""
                    }`}
                    onClick={() => handleSelectUser(user)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-lg">{formattedName(user)}</p>
                        <p className="text-sm text-slate-400">{user.username}</p>
                        <p className="text-sm text-slate-400">{user.email}</p>
                      </div>
                      <button className="text-sm px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700">
                        View
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">No users found.</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            {!selectedUser ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
                <div className="text-4xl">👋</div>
                <p>Select a user to review their expenses.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-400">Selected user</p>
                    <h2 className="text-2xl font-semibold">{formattedName(selectedUser)}</h2>
                    <p className="text-slate-400 text-sm">{selectedUser.email}</p>
                  </div>
                  <div className="text-sm bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                    ID: {selectedUser._id}
                  </div>
                </div>

                {loadingExpenses ? (
                  <p className="text-slate-400">Loading expenses…</p>
                ) : expenses.length ? (
                  <div className="overflow-x-auto border border-slate-800 rounded-xl">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-800 text-slate-300">
                        <tr>
                          <th className="px-4 py-3">Title</th>
                          <th className="px-4 py-3">Amount</th>
                          <th className="px-4 py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.map((expense) => (
                          <tr
                            key={expense._id}
                            className="border-t border-slate-800 hover:bg-slate-800/50"
                          >
                            <td className="px-4 py-3 font-medium text-white">{expense.title}</td>
                            <td className="px-4 py-3 text-indigo-200">₹{Number(expense.amount).toLocaleString()}</td>
                            <td className="px-4 py-3 text-slate-400">{expense.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-slate-400 bg-slate-800/60 border border-slate-700 rounded-xl p-6 text-center">
                    No expenses to show.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
