import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import API_URL from '../config/api'

const UpdateExpense = () => {
  const { expenseId } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    date: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (expenseId) {
      fetchExpense()
    }
  }, [expenseId])

  const fetchExpense = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/expenses/get/${expenseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const expense = response.data.expense;
      
      // Format date from MongoDB ISO format to YYYY-MM-DD
      const formattedDate = expense.date ? new Date(expense.date).toISOString().split('T')[0] : "";
      
      setFormData({
        title: expense.title || "",
        amount: expense.amount || "",
        date: formattedDate
      })
    } catch (err) {
      console.log(err);
      setError("Error loading expense. Please try again.");
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/expenses/update/${expenseId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data);
      setSuccess("Expense updated successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Error updating expense");
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-gray-800 shadow-lg rounded-2xl border border-gray-700">
        <button
          onClick={() => navigate("/")}
          className="mb-4 text-gray-400 hover:text-indigo-400 transition text-2xl"
        >
          ←
        </button>
        <h2 className="text-2xl font-bold text-indigo-400 mb-6 text-center">
          Update Expense
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-400 text-sm animate-in fade-in duration-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg text-green-400 text-sm animate-in fade-in duration-300">
            ✓ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-300">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter expense title"
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-300">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-300">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-500 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Expense"}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/delete/${expenseId}`)}
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-500 transition mt-3"
          >
            Delete Expense
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateExpense