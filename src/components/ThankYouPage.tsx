// src/components/ThankYouPage.tsx
import React, { useEffect } from "react";
import logo1 from "../assets/valenzuela-bg.jpg";
import logo2 from "../assets/valenzuela-logo.png";

interface ThankYouPageProps {
  onClose: () => void;
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({ onClose }) => {
  // prevent background scroll while thank you is shown
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${logo1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* darkened backdrop */}
      <div className="absolute inset-0  bg-black/10 p-4 backdrop-blur-sm bg-opacity-50" />

      {/* centered card */}
      <div className="relative z-10 w-full max-w-lg bg-blue-600 bg-opacity-95 rounded-xl p-6 sm:p-8 shadow-2xl text-center">
        <button
          onClick={onClose}
          aria-label="Close thank you"
          className="absolute -top-3 -right-3 bg-red-600 text-white font-bold py-1.5 px-3 rounded-full hover:bg-red-700 transition shadow"
        >
          ✕
        </button>

        <div className="flex items-center justify-center gap-4 mb-4">
          <img src={logo2} alt="logo" className="h-10 w-10 sm:h-12 sm:w-12" />
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2">
          Thank you!
        </h2>
        <p className="text-sm sm:text-base text-white font-semibold">
          For answering the survey.
        </p>
      </div>
    </div>
  );
};

export default ThankYouPage;
