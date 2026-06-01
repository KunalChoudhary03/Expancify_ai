import React from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    title: "Add an expense",
    points: [
      "Open the home page or tap Add Expense from the navigation.",
      "Enter the expense title, amount, date, and any note if you want.",
      "Save it to see it appear instantly in your expense list."
    ]
  },
  {
    title: "Manage your spending",
    points: [
      "Tap any expense card to open edit and delete options.",
      "Use the list view to review daily spending and spot repeated purchases.",
      "Check the total card at the top to understand your overall spend."
    ]
  },
  {
    title: "Create a room",
    points: [
      "Go to Create Circle from the navbar.",
      "Add the room name and details for the people you share expenses with.",
      "Share the room with your roommates so everyone can track common expenses together."
    ]
  },
  {
    title: "Use the dashboard",
    points: [
      "Open the AI Dashboard to get smart insights about your spending.",
      "Review shared and personal expenses separately.",
      "Use the insights to cut unwanted expenses and save more money."
    ]
  }
];

const GuidePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(74,112,169,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(90,125,181,0.12),transparent_30%)]" />

      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-indigo-300"
          >
            <span className="text-xl leading-none">←</span>
            Back
          </button>

          <div className="mb-10 max-w-3xl animate-[fadeInUp_0.7s_ease-out]">
            <p className="mb-3 text-xs uppercase tracking-[0.45em] text-indigo-200/70">Guide Me</p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-linear-to-r from-white via-[#E4ECF8] to-[#9DB3D4] bg-clip-text text-transparent">
              How to use Expancify
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-8 text-slate-300 max-w-2xl">
              Follow these simple steps to add expenses, create rooms, and keep track of shared spending without confusion.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {steps.map((step, index) => (
              <section
                key={step.title}
                className="rounded-2xl border border-white/8 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:bg-white/7 animate-[fadeInUp_0.8s_ease-out]"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-[#4A70A9] to-[#5A7DB5] text-sm font-black shadow-lg shadow-[#4A70A9]/30">
                    0{index + 1}
                  </div>
                  <h2 className="text-xl font-semibold text-white">{step.title}</h2>
                </div>

                <ul className="space-y-3 text-slate-300">
                  {step.points.map((point) => (
                    <li key={point} className="flex gap-3 leading-7">
                      <span className="mt-2 h-2.5 w-2.5 flex-none rounded-full bg-indigo-400" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-[#4A70A9]/30 bg-linear-to-r from-[#0d1525] to-[#111d33] p-6 shadow-2xl shadow-black/20 animate-[fadeInUp_0.95s_ease-out]">
            <h3 className="text-xl font-semibold text-white">Quick tip</h3>
            <p className="mt-2 text-slate-300 leading-7">
              Start by adding your daily expenses first. Once your room is created, add shared costs there so everyone can split them cleanly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidePage;