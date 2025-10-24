import "./App.css";
import logo from "./assets/valenzuela-logo.png";
import logo1 from "./assets/valenzuela-bg.jpg";
import React, { useState } from "react";
import SurveyForm from "./components/SurveyForm";

// --- New Button Component (No Dependencies) ---

const StyledButtonCSS = () => (
  <style>{`
    .btn-wrapper {
      /* This wrapper div allows the button to be centered */
      display: inline-block; 
    }
  
    .btn {
      /* --color is set by an inline style on the .btn-wrapper */
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all .5s;
      border: none;
      background-color: transparent;
      padding: 0; /* Remove default padding */
    }

    /* The visible button surface */
    .btn div {
      letter-spacing: 2px;
      font-weight: bold;
      background: var(--color);
      border-radius: 2rem;
      color: white;
      padding: 1rem 1.5rem; /* Adjusted padding */
      font-size: 1rem; /* Added font size */
      text-transform: uppercase; /* Match style */

      /* Remove inner border — outer container will show the border on hover */
      border: 2px solid transparent;
      transition: transform .25s ease;
      position: relative;
      z-index: 1;
    }

    /* remove inner-div border change on hover so only outer container shows border */
    .btn:hover div {
      transform: scale(1.03);
    }

    /* Outer decorative border — start transparent and become visible on hover */
    .btn::before {
      content: '';
      z-index: 0;
      background-color: var(--color);
      border: 2px solid transparent;
      border-radius: 2rem;
      width: 110%;
      height: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) rotate(10deg);
      transition: .25s ease, border-color .25s ease, opacity .25s ease;
      opacity: 0.2;
      pointer-events: none;
    }

    .btn:hover {
      cursor: pointer;
      filter: brightness(1.2);
      transform: scale(1.05);
    }

    .btn:hover::before {
      transform: translate(-50%, -50%) rotate(0deg);
      opacity: 1;
      border-color: black; /* only the outer ::before shows the border on hover */
    }

    .btn svg {
      transform: translateX(-200%);
      transition: .5s;
      width: 0;
      opacity: 0;
    }

    .btn:hover svg {
      width: 25px;
      transform: translateX(0%);
      opacity: 1;
    }

    .btn:active {
      filter: brightness(1.4);
    }
  `}</style>
);

type ButtonProps = {
  children: React.ReactNode;
  color?: string;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({ children, color, onClick }) => {
  // Cast style to any to allow CSS custom property --color in TSX
  const wrapperStyle = {
    ["--color" as any]: color || "#ffcd39",
  } as React.CSSProperties;

  return (
    <div className="btn-wrapper" style={wrapperStyle}>
      <button className="btn" onClick={onClick} type="button">
        <div>{children}</div>
        <svg
          fill="none"
          viewBox="0 0 24 24"
          height="25px"
          width="25px"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeMiterlimit={10}
            strokeWidth={2}
            stroke="black"
            d="M11.6801 14.62L14.2401 12.06L11.6801 9.5"
          />
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeMiterlimit={10}
            strokeWidth={2}
            stroke="black"
            d="M4 12.0601H14.17"
          />
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeMiterlimit={10}
            strokeWidth={2}
            stroke="black"
            d="M12 4C16.42 4 20 7 20 12C20 17 16.42 20 12 20"
          />
        </svg>
      </button>
    </div>
  );
};
// --- End of Button Component ---

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showSurveyForm, setShowSurveyForm] = useState(false);

  const headerBgClass = showSurveyForm ? "bg-black/40" : "bg-white";
  const headerTitleColorClass = showSurveyForm ? "text-white" : "text-gray-800";
  const headerSubtitleColorClass = showSurveyForm
    ? "text-white"
    : "text-gray-600";

  const handleTakeSurveyClick = () => {
    setShowSurveyModal(true);
  };

  const handleCloseModalAndProceedToSurvey = () => {
    setShowSurveyModal(false);
    setShowWelcome(false);
    setShowSurveyForm(true);
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col`}
      style={{
        backgroundImage: `url(${logo1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <StyledButtonCSS />

      {!showSurveyForm && (
        <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-sm"></div>
      )}

      {showSurveyForm && (
        <div className="absolute inset-0 backdrop-blur-md"></div>
      )}

      <div
        className={`header relative z-20 ${headerBgClass} flex items-center p-4 sm:p-5 md:p-6 shadow-md transition-all duration-300`}
      >
        <img
          src={logo}
          alt="Valenzuela-Logo"
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mr-3 sm:mr-4 ml-2 sm:ml-4 md:ml-8 rounded-full"
        />
        <div className="flex flex-col">
          <h1
            className={`text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase leading-none ${headerTitleColorClass}`}
          >
            City Government of Valenzuela
          </h1>
          <h2
            className={`text-xs sm:text-sm md:text-lg lg:text-xl font-normal leading-none ${headerSubtitleColorClass}`}
          >
            Metropolitan Manila
          </h2>
        </div>
      </div>

      <div
        className={`relative z-30 flex-grow overflow-auto ${
          showSurveyForm ? "block" : "flex items-center justify-center"
        }`}
      >
        {showWelcome && !showSurveyModal && (
          <div className="relative z-30 px-4 text-center text-white mx-auto max-w-sm md:max-w-md lg:max-w-2xl py-6">
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
            <div className="mt-8 sm:mt-10">
              <Button color="#dc2626" onClick={handleTakeSurveyClick}>
                Take Survey
              </Button>
            </div>
          </div>
        )}

        {showSurveyModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4 backdrop-blur-sm">
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
              <div className="mt-2 sm:mt-4">
                {/* Old/standard Close button restored (don't use the custom Take Survey Button here) */}
                <button
                  onClick={handleCloseModalAndProceedToSurvey}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold"
                  type="button"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showSurveyForm && (
          <div className="relative z-30 w-full max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
            <SurveyForm />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
