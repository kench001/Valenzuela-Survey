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
    // Main container: Changed to min-h-screen for better mobile browser support
    <div
      className={`relative min-h-screen flex flex-col`}
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

      {/* Header - Adjusted padding and logo/text sizes for mobile-first */}
      <div
        className={`header relative z-20 ${headerBgClass} flex items-center p-4 sm:p-5 md:p-6 shadow-md transition-all duration-300`}
      >
        <img
          src={logo}
          alt="Valenzuela-Logo"
          // Base size is mobile-friendly, scales up
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mr-3 sm:mr-4 ml-2 sm:ml-4 md:ml-8"
        />
        <div className="flex flex-col">
          <h1
            className={`
              text-lg sm:text-2xl md:text-3xl lg:text-4xl 
              font-extrabold uppercase leading-none ${headerTitleColorClass}`}
          >
            City Government of Valenzuela
          </h1>
          <h2
            className={`
              text-xs sm:text-sm md:text-lg lg:text-xl 
              font-normal leading-none ${headerSubtitleColorClass}`}
          >
            Metropolitan Manila
          </h2>
        </div>
      </div>

      {/* Main content area - Changed layout logic for survey form scrolling */}
      <div
        className={`relative z-30 flex-grow overflow-auto 
          ${
            showSurveyForm
              ? "block" // Use block layout for survey to allow scrolling from the top
              : "flex items-center justify-center" // Use flex-center for welcome/modal
          }`}
      >
        {showWelcome && !showSurveyModal && (
          <div className="relative z-30 px-4 text-center text-white mx-auto max-w-sm md:max-w-md lg:max-w-2xl py-6">
            {/* Main text content - reduced base text size for mobile */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
              Thank You!
            </h1>
            <div className="w-1/2 h-1 bg-white mx-auto my-4 md:my-6"></div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-4">
              For Availing the Service
            </h1>
            <p className="mt-6 sm:mt-8 text-base sm:text-xl md:text-2xl font-light">
              We'd just like to know about your experience
            </p>
            <button
              onClick={handleTakeSurveyClick}
              className="
                mt-8 sm:mt-10 px-10 py-3 sm:px-12 sm:py-4 
                bg-red-600 text-white font-extrabold text-base sm:text-lg 
                rounded-full hover:bg-red-700 transition duration-150 shadow-lg 
                uppercase tracking-wide cursor-pointer"
            >
              Take Survey
            </button>
          </div>
        )}

        {showSurveyModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4 backdrop-blur-sm">
            {/* Set a comfortable mobile-first max-width */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl text-gray-800 text-center max-w-sm md:max-w-md lg:max-w-lg">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-blue-700">
                Client Satisfaction Measurement
              </h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed font-medium text-gray-700 mb-6">
                This Client Satisfaction Measurement (CSM) tracks the customer
                experience of government offices. Your feedback on your recently
                concluded transaction will help this office provide a better
                service. Personal information shared will be kept confidential
                and you always have the option to not answer this form.
              </p>
              <button
                onClick={handleCloseModalAndProceedToSurvey}
                className="
                  cursor-pointer mt-2 sm:mt-4 px-8 py-2 sm:py-2.5 
                  bg-blue-600 text-white rounded-lg font-bold text-base md:text-lg 
                  hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* This is where the SurveyForm component will now render the questions */}
        {showSurveyForm && (
          // This container now has padding and a mobile-first max-width
          <div className="relative z-30 w-full max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
            <SurveyForm />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
