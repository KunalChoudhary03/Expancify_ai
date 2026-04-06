import React from "react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
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
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4 text-white">
              About Expansify
            </h1>
            <p className="text-gray-400 text-lg">
              Hi, I'm{" "}
              <span className="text-indigo-400 font-semibold">
                Kunal Choudhary
              </span>
              , the creator of{" "}
              <span className="text-indigo-400 font-semibold">
                Expansify
              </span>
              .
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">

            {/* Introduction */}
            <p className="text-gray-300 leading-relaxed">
              Expansify is more than just an expense tracker - it's a smart
              financial awareness platform designed to help people take control
              of their money and eliminate unnecessary spending.
            </p>

            {/* Vision */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-indigo-400">
                 My Vision
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                My vision is to grow Expansify into a powerful financial
                companion that not only tracks expenses but also intelligently
                analyzes spending patterns using AI.
              </p>
              <p className="text-gray-300 leading-relaxed">
                I want to help individuals identify unwanted expenses, reduce
                wasteful spending, and build better financial habits.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-indigo-400">
                 Mission
              </h2>
              <p className="text-gray-300 leading-relaxed">
                To empower people with clarity over their finances and help them
                minimize unwanted expenses through technology and smart
                analytics.
              </p>
            </div>

            {/* GitHub CTA */}
            <div>
              <a
                href="https://github.com/KunalChoudhary03"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300 px-8 py-3 rounded-lg font-semibold"
              >
                 View My GitHub
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;