import React from "react";
import { useNavigate } from "react-router-dom";
import ExpenseList from "./ExpenseList";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-950 min-h-screen pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <ExpenseList />
      </div>
    </div>
  );
};

export default Home;