import React from "react";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-indigo-400 mb-8 transition text-2xl"
          >
            ←
          </button>

          {/* Heading */}
          <div className="mb-12 animate-in fade-in slide-in-from-top duration-500">
            <h1 className="text-4xl font-bold mb-4 text-white">Expansify Features</h1>
            <p className="text-gray-400 text-lg">
              Smart expense tracking and analysis to help you manage your money better.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-4">
            {[
              {
                title: "Expense Tracking",
                desc: "Add, update and manage your daily expenses easily in one place."
              },
              {
                title: "Expense Analysis",
                desc: "Analyze your spending habits with smart insights and summary reports."
              },
              {
                title: "Unwanted Expense Detection",
                desc: "Identify unnecessary expenses and discover areas where you can save money."
              },
              {
                title: "Roommate Circles",
                desc: "Create circles with your roommates to track shared expenses together in one dashboard."
              },
              {
                title: "Circle Expense Reports",
                desc: "Generate circle-wise reports and monitor unwanted expenses for each member with clear summaries."
              },
              {
                title: "AI Insights",
                desc: "Get intelligent recommendations based on your spending patterns."
              },
              {
                title: "Secure & Private",
                desc: "Your data is protected and accessible only to you."
              },
              {
                title: "Mobile Friendly",
                desc: "Access your expenses anytime, anywhere on any device."
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 animate-in fade-in slide-in-from-left"
                style={{animationDelay: `${idx * 100}ms`}}
              >
                <div className="flex items-start gap-4">
                 
                  <div>
                    <h2 className="text-xl font-semibold mb-2 text-indigo-400">
                      {feature.title}
                    </h2>
                    <p className="text-gray-400">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;