import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/api/expenses/get`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setExpenses(response.data.expenses || response.data);
      } catch (err) {
        console.log(err.response?.data || err.message);
      }
    };

    fetchExpenses();
  }, []);

  // 📌 Group expenses by date
  const groupByDate = (expenses) => {
    const grouped = {};

    expenses.forEach((expense) => {
      const dateObj = new Date(expense.date);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      let label = dateObj.toLocaleDateString();

      if (dateObj.toDateString() === today.toDateString()) {
        label = "Today";
      } else if (dateObj.toDateString() === yesterday.toDateString()) {
        label = "Yesterday";
      }

      if (!grouped[label]) {
        grouped[label] = [];
      }

      grouped[label].push(expense);
    });

    return grouped;
  };

  const groupedExpenses = groupByDate(expenses);
  
  // Calculate total expense
  const totalExpense = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

  const handleCardClick = (expense) => {
    setSelectedExpense(expense);
  };

  const handleUpdate = () => {
    navigate(`/update/${selectedExpense._id}`);
    setSelectedExpense(null);
  };

  const handleDelete = () => {
    navigate(`/delete/${selectedExpense._id}`);
    setSelectedExpense(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-24 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header with Total */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="animate-in fade-in slide-in-from-left duration-500">
            <h2 className="text-3xl font-bold text-white">
              My Expenses
            </h2>
          </div>

          {/* Total Expense Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-right duration-500 group">
            <p className="text-indigo-200 text-sm font-medium mb-1 group-hover:text-white transition">Total Expenses</p>
            <h3 className="text-3xl font-bold text-white group-hover:text-indigo-100 transition">₹ {totalExpense.toLocaleString()}</h3>
            <p className="text-indigo-300 text-xs mt-2">{expenses.length} transactions</p>
          </div>
        </div>

        {/* Expense List */}
        {Object.keys(groupedExpenses).length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-2xl text-center border border-gray-700 animate-in fade-in duration-500">
            <p className="text-gray-400 text-lg">
              No expenses found. Start adding one!
            </p>
          </div>
        ) : (
          Object.entries(groupedExpenses).map(([date, items], index) => (
            <div key={date} className={`mb-8 animate-in fade-in slide-in-from-bottom duration-500`} style={{animationDelay: `${index * 100}ms`}}>
              
              {/* Date Heading */}
              <h3 className="text-xl text-white font-semibold mb-4 text-gray-300">
                {date}
              </h3>

              <div className="space-y-3">
                {items.map((expense, itemIndex) => (
                  <div
                    key={expense._id}
                    onClick={() => handleCardClick(expense)}
                    className="bg-gray-800 p-5 rounded-xl flex justify-between items-center shadow-md hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500 hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-700 group animate-in fade-in slide-in-from-left duration-500"
                    style={{animationDelay: `${itemIndex * 50}ms`}}
                  >
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition duration-300">
                        {expense.title}
                      </h4>
                    </div>

                    <span className="text-xl font-bold text-green-400 group-hover:text-green-300 group-hover:scale-110 transition-all duration-300">
                      ₹ {expense.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Update/Delete Options */}
      {selectedExpense && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700 max-w-sm w-full mx-4 animate-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-white mb-4 text-center">
              {selectedExpense.title}
            </h3>
            
            <div className="bg-gray-700 p-4 rounded-lg mb-6 text-center border border-gray-600">
              <p className="text-gray-400 text-sm">Amount</p>
              <p className="text-green-400 text-2xl font-bold">₹ {selectedExpense.amount}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleUpdate}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-500 transition duration-200"
              >
                Edit Expense
              </button>
              <button
                onClick={handleDelete}
                className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-500 transition duration-200"
              >
                Delete Expense
              </button>
              <button
                onClick={() => setSelectedExpense(null)}
                className="w-full bg-gray-700 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Add Button - Smaller */}
      <button
        onClick={() => navigate("/AddExpense")}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-5 py-2 rounded-full shadow-lg hover:bg-indigo-500 hover:shadow-indigo-500/50 hover:scale-110 active:scale-95 transition-all duration-300 font-semibold text-sm z-50 flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom duration-500"
      >
        <span className="text-lg">+</span>
        Add
      </button>
    </div>
  );
};

export default ExpenseList;