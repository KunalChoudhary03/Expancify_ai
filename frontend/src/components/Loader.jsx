import React from "react";

const Loader = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-[#08111f] text-white relative flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(74,112,169,0.38),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(90,125,181,0.18),_transparent_32%)] animate-[loaderGlow_6s_ease-in-out_infinite]" />
      <div className="absolute inset-0 opacity-35 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_30%,transparent_70%,rgba(255,255,255,0.05)_100%)] animate-[loaderDrift_10s_linear_infinite]" />

      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full border border-white/15 bg-white/10 shadow-[0_0_80px_rgba(74,112,169,0.35)] backdrop-blur-md animate-[loaderFloat_4.2s_ease-in-out_infinite]">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#4A70A9] via-[#5A7DB5] to-[#203552] shadow-lg shadow-[#4A70A9]/40 animate-[loaderPulse_2.8s_ease-in-out_infinite]">
            <span className="text-3xl font-black tracking-wide">E</span>
          </div>
        </div>

        <p className="mb-4 text-xs uppercase tracking-[0.5em] text-[#C7D5EA]/80 animate-[fadeIn_0.9s_ease-out]">
          Loading your space
        </p>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-[#E4ECF8] to-[#9DB3D4] bg-clip-text text-transparent animate-[fadeInUp_0.9s_ease-out]">
          Expancify
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg md:text-xl leading-8 text-slate-300 animate-[fadeInUp_1.15s_ease-out]">
          Your personal expense tracker to spot unwanted spending and stay in control of every rupee.
        </p>

        <div className="mt-10 flex items-center justify-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#C7D5EA] animate-[loaderDot_1.2s_ease-in-out_infinite] [animation-delay:-0.24s]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#6E8DBA] animate-[loaderDot_1.2s_ease-in-out_infinite] [animation-delay:-0.12s]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#4A70A9] animate-[loaderDot_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};

export default Loader;