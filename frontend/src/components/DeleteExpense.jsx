import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import API_URL from '../config/api'

const DeleteExpense = () => {
  const { expenseId } = useParams()
  const navigate = useNavigate()
  const [expense, setExpense] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (expenseId) {
      fetchExpense()
    }
  }, [expenseId])

  const fetchExpense = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await axios.get(
        `${API_URL}/api/expenses/get/${expenseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setExpense(response.data.expense)
      setError("")
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || "Error loading expense")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      const token = localStorage.getItem("token")
      await axios.delete(
        `${API_URL}/api/expenses/delete/${expenseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setError("")
      setTimeout(() => navigate("/"), 1500)
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || "Error deleting expense")
    } finally {
      setDeleting(false)
      setShowConfirmation(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (error && !expense) {
    return (
      <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-gray-800 shadow-lg rounded-2xl border border-red-500">
          <button
            onClick={() => navigate("/")}
            className="mb-4 text-gray-400 hover:text-indigo-400 transition text-2xl"
          >
            ←
          </button>
          <div className="text-red-400 text-center">{error}</div>
        </div>
      </div>
    )
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

        <h2 className="text-2xl font-bold text-red-400 mb-6 text-center">
          Delete Expense
        </h2>

        {expense && (
          <div className="space-y-6">
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <div className="mb-4">
                <p className="text-gray-400 text-sm">Title</p>
                <p className="text-white text-lg font-semibold">{expense.title}</p>
              </div>
              <div className="mb-4">
                <p className="text-gray-400 text-sm">Amount</p>
                <p className="text-green-400 text-2xl font-bold">₹ {expense.amount}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Date</p>
                <p className="text-white">
                  {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="bg-red-900/20 border border-red-700 p-3 rounded-lg">
              <p className="text-red-300 text-sm text-center">
                ⚠️ This action cannot be undone. Are you sure you want to delete this expense?
              </p>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-700 p-3 rounded-lg animate-in fade-in duration-300">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {!showConfirmation ? (
              <button
                onClick={() => setShowConfirmation(true)}
                className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-500 transition"
              >
                Delete Expense
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full bg-red-700 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  disabled={deleting}
                  className="w-full bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DeleteExpense