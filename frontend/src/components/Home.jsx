import React from "react";
import ExpenseList from "./ExpenseList";

const Home = () => {
  return (
    <div className="bg-gray-950 min-h-screen pt-24 pb-12 animate-[fadeIn_0.45s_ease-out]">
      <div className="max-w-6xl mx-auto px-4">
        <ExpenseList />
      </div>
    </div>
  );
};

export default Home;