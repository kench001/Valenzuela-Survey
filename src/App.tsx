import "./App.css";
import logo from "./assets/valenzuela-logo.png";
import logo1 from "./assets/valenzuela-bg.jpg";
import { useState } from "react";
import SurveyForm from "./components/SurveyForm"; // Make sure this import is correct

function App() {
  const [showWelcome, setShowWelcome] = useState(true); // Start with welcome screen
  const [showSurveyModal, setShowSurveyModal] = useState(false); // Modal hidden initially
  const [showSurveyForm, setShowSurveyForm] = useState(false); // Survey form hidden initially

  // Determine header background and text colors
  const headerBgClass = showSurveyForm ? "bg-black/40" : "bg-white"; // Transparent black for survey, white for landing
  const headerTitleColorClass = showSurveyForm ? "text-white" : "text-gray-800";
  const headerSubtitleColorClass = showSurveyForm
    ? "text-white"
    : "text-gray-600";

  // Handler for "Take Survey" button on the welcome screen
  const handleTakeSurveyClick = () => {
    setShowSurveyModal(true); // Show the modal
  };

  // Handler for "Close" button on the modal
  const handleCloseModalAndProceedToSurvey = () => {
    setShowSurveyModal(false); // Hide the modal
    setShowWelcome(false); // Hide the welcome screen
    setShowSurveyForm(true); // Show the main survey form
  };

  return (
    // Main container with background image and conditional blur/overlay
    <div
      className={`relative h-screen flex flex-col`}
      style={{
        backgroundImage: `url(${logo1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Conditional overlay for the landing page state (blue overlay) */}
      {!showSurveyForm && (
        <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-sm"></div>
      )}

      {/* Conditional blur directly on the main container when survey is active */}
      {showSurveyForm && (
        <div className="absolute inset-0 backdrop-blur-md">
          {/* Darker overlay for survey form */}
        </div>
      )}

      {/* Header - Always present, but with conditional styling */}
      <div
        className={`header relative z-20 ${headerBgClass} flex items-center p-3 sm:p-6 md:p-8 lg:p-12 shadow-md transition-all duration-300`}
      >
        <img
          src={logo}
          alt="Valenzuela-Logo"
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mr-2 sm:mr-4 ml-3 sm:ml-6 md:ml-8 lg:ml-16"
        />
        <div className="flex flex-col">
          <h1
            className={`text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold uppercase leading-none ${headerTitleColorClass}`}
          >
            City Government of Valenzuela
          </h1>
          <h2
            className={`text-sm sm:text-lg md:text-xl lg:text-2xl font-normal leading-none ${headerSubtitleColorClass}`}
          >
            Metropolitan Manila
          </h2>
        </div>
      </div>

      {/* Main content area - conditionally renders welcome, modal, or survey form */}
      <div className="relative z-30 flex-grow flex items-center justify-center p-4 overflow-auto">
        {showWelcome && !showSurveyModal && (
          <div className="relative z-30 px-3 text-center text-white mx-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl">
            {/* Main text content matching the desired blue background look */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold">
              Thank You!
            </h1>
            <div className="w-2/3 sm:w-1/2 h-1 bg-white mx-auto my-4"></div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-4">
              For Availing the Service
            </h1>
            <p className="mt-6 sm:mt-8 text-lg sm:text-2xl md:text-3xl font-light">
              We'd just like to know about your experience
            </p>
            <button
              onClick={handleTakeSurveyClick}
              className="mt-8 sm:mt-10 px-8 sm:px-10 md:px-12 py-3 sm:py-4 bg-red-600 text-white font-extrabold text-base sm:text-xl md:text-xl rounded-full hover:bg-red-700 transition duration-150 shadow-lg uppercase tracking-wide cursor-pointer"
            >
              Take Survey
            </button>
          </div>
        )}

        {showSurveyModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4 backdrop-blur-sm">
            <div className="bg-white p-5 sm:p-6 md:p-8 rounded-xl shadow-2xl text-gray-800 text-center max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-blue-700">
                Client Satisfaction Measurement
              </h2>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed font-medium text-gray-700 mb-6 max-w-full mx-auto">
                This Client Satisfaction Measurement (CSM) tracks the customer
                experience of government offices. Your feedback on your recently
                concluded transaction will help this office provide a better
                service. Personal information shared will be kept confidential
                and you always have the option to not answer this form.
              </p>
              <button
                onClick={handleCloseModalAndProceedToSurvey}
                className="cursor-pointer mt-2 sm:mt-4 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm sm:text-base md:text-lg hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* This is where the SurveyForm component will now render the questions */}
        {showSurveyForm && (
          <div className="relative z-30 w-full max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto px-4">
            <SurveyForm />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
