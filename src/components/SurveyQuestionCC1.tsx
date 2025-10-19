import React, { useState } from "react";

interface SurveyQuestionCC1Props {
  onNext: () => void;
  onBack?: () => void;
}

const SurveyQuestionCC1: React.FC<SurveyQuestionCC1Props> = ({
  onNext,
  onBack,
}) => {
  const [selected, setSelected] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleNext = () => {
    if (!selected) {
      setError("Please select an option to continue.");
      return;
    }
    setError("");
    onNext();
  };

  return (
    // Main Container:
    // REMOVED max-w-5xl, mx-auto, my-auto, max-h-full, overflow-y-auto.
    // This component should be w-full and let the PAGE scroll, not the card.
    // The parent (App.tsx) already handles max-width and centering.
    // Adjusted base padding to p-4 for better mobile fit.
    <div
      className="
      relative w-full flex flex-col justify-between 
      bg-gray-800 rounded-xl shadow-2xl
      p-4 sm:p-6 md:p-8
    "
    >
      {/* Top section with sliders - This is already responsive */}
      <div className="mb-4 p-4 bg-gray-700 rounded-lg shadow-inner">
        <div className="flex items-center justify-center space-x-4 m-1 mb-4">
          <div className="relative flex-grow h-2 bg-gray-500 rounded-full">
            {/* Slider track - Current (CC1) is at the start */}
            <div
              className="absolute h-full bg-red-600 rounded-full"
              style={{ width: "10%" }}
            ></div>{" "}
            {/* Indicate CC1 progress */}
            <div
              className="absolute -ml-2 w-5 h-5 bg-red-600 rounded-full shadow border-2 border-red-600 cursor-pointer"
              style={{ left: "10%" }}
            ></div>{" "}
            {/* Current dot */}
            <div
              className="absolute -ml-2 w-5 h-5 bg-white rounded-full shadow border-2 border-gray-400 cursor-pointer"
              style={{ left: "50%" }}
            ></div>{" "}
            {/* Future dot */}
            <div
              className="absolute -ml-2 w-5 h-5 bg-white rounded-full shadow border-2 border-gray-400 cursor-pointer"
              style={{ left: "90%" }}
            ></div>{" "}
            {/* Future dot */}
          </div>
        </div>
      </div>

      {/* Instructions - This is already perfect mobile-first */}
      <div className="bg-blue-700 p-4 rounded-lg mb-6">
        <p className="text-white text-base sm:text-lg font-normal leading-relaxed">
          <span className="font-bold">INSTRUCTIONS:</span> Please place a{" "}
          <span className="font-bold">Check mark (✓)</span> in the designated
          box that corresponds to your answer on the Citizen's Charter (CC)
          questions. The Citizen's Charter is an official document that reflects
          the services of a government agency/office including its requirements,
          fees, and processing times among others.
        </p>
      </div>

      {/* Question CC1 - This is already perfect mobile-first */}
      <div className="bg-gray-600 p-4 rounded-lg flex-grow">
        <h3 className="text-white text-xl sm:text-2xl font-extrabold mb-4">
          CC1{" "}
          <span className="font-normal">
            Which of the following best describes your awareness of a CC?
          </span>
        </h3>
        <div className="space-y-3">
          <label className="inline-flex items-center w-full">
            <input
              type="radio"
              name="cc1"
              className="form-radio h-5 w-5 text-red-600 bg-gray-700 border-gray-500"
              value="1"
              checked={selected === "1"}
              onChange={() => setSelected("1")}
            />
            <span className="ml-3 text-white text-base sm:text-lg">
              1. I know what a CC is and I saw this office's CC.
            </span>
          </label>
          <label className="inline-flex items-center w-full">
            <input
              type="radio"
              name="cc1"
              className="form-radio h-5 w-5 text-red-600 bg-gray-700 border-gray-500"
              value="2"
              checked={selected === "2"}
              onChange={() => setSelected("2")}
            />
            <span className="ml-3 text-white text-base sm:text-lg">
              2. I know what a CC is but I did not see this office's CC.
            </span>
          </label>
          <label className="inline-flex items-center w-full">
            <input
              type="radio"
              name="cc1"
              className="form-radio h-5 w-5 text-red-600 bg-gray-700 border-gray-500"
              value="3"
              checked={selected === "3"}
              onChange={() => setSelected("3")}
            />
            <span className="ml-3 text-white text-base sm:text-lg">
              3. I learned of the CC only when I saw this office's CC.
            </span>
          </label>
          <label className="inline-flex items-center w-full">
            <input
              type="radio"
              name="cc1"
              className="form-radio h-5 w-5 text-red-600 bg-gray-700 border-gray-500"
              value="4"
              checked={selected === "4"}
              onChange={() => setSelected("4")}
            />
            <span className="ml-3 text-white text-base sm:text-lg">
              4. I do not know what a CC is and I did not see one in this
              office. (Answer 'N/A' on CC2 and CC3)
            </span>
          </label>
        </div>
        {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
      </div>

      {/* Back and Next Buttons - Standardized mobile-first sizes */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={onBack}
          disabled={!onBack}
          className={`
            px-5 py-2 text-sm font-bold 
            sm:px-6 sm:text-base 
            bg-gray-500 text-white rounded-full 
            hover:bg-gray-600 transition duration-150 shadow-sm 
            uppercase tracking-wide cursor-pointer 
            ${!onBack ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          Back
        </button>

        <button
          onClick={handleNext}
          className="
            px-6 py-2 text-base font-extrabold 
            sm:px-8 sm:text-lg
            bg-red-600 text-white rounded-full 
            hover:bg-red-700 transition duration-150 shadow-lg 
            uppercase tracking-wide cursor-pointer
          "
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SurveyQuestionCC1;
