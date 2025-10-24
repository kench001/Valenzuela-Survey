import React, { useState } from "react";
// We will use pure Tailwind CSS for styling.

// Data for the radio options
const cc1Options = [
  {
    value: "1",
    label: "1. I know what a CC is and I saw this office's CC.",
  },
  {
    value: "2",
    label: "2. I know what a CC is but I did not see this office's CC.",
  },
  {
    value: "3",
    label: "3. I learned of the CC only when I saw this office's CC.",
  },
  {
    value: "4",
    label:
      "4. I do not know what a CC is and I did not see one in this office. (Answer 'N/A' on CC2 and CC3)",
  },
];

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

  const handleSelection = (value: string) => {
    setSelected(value);
    if (error) {
      setError("");
    }
  };

  return (
    <div
      className="
      relative w-full flex flex-col justify-between 
      bg-gray-800 rounded-xl shadow-2xl
      p-3 sm:p-5 md:p-6
    "
    >
      {/* Top section with sliders - REDUCED padding and margin */}
      <div className="mb-3 p-3 bg-gray-600 rounded-lg shadow-inner">
        <div className="flex items-center justify-center space-x-4 m-1 mb-3">
          <div className="relative flex-grow h-2 bg-gray-500 rounded-full">
            <div
              className="absolute h-full bg-red-600 rounded-full"
              style={{ width: "10%" }}
            ></div>{" "}
            <div
              className="absolute -ml-2 w-5 h-5 bg-red-600 rounded-full shadow border-2 border-red-600 cursor-pointer"
              style={{ left: "10%" }}
            ></div>{" "}
            <div
              className="absolute -ml-2 w-5 h-5 bg-white rounded-full shadow border-2 border-gray-400 cursor-pointer"
              style={{ left: "50%" }}
            ></div>{" "}
            <div
              className="absolute -ml-2 w-5 h-5 bg-white rounded-full shadow border-2 border-gray-400 cursor-pointer"
              style={{ left: "90%" }}
            ></div>{" "}
          </div>
        </div>
      </div>

      {/* Instructions - REDUCED padding and margin */}
      <div className="bg-blue-700 p-3 rounded-lg mb-4">
        <p className="text-white text-base sm:text-lg font-normal leading-relaxed">
          <span className="font-bold">INSTRUCTIONS:</span> Please choose in the
          designated choices that corresponds to your answer on the Citizen's
          Charter (CC) questions. The Citizen's Charter is an official document
          that reflects the services of a government agency/office including its
          requirements, fees, and processing times among others.
        </p>
      </div>

      {/* Question CC1 - REDUCED padding, bg-gray-600 */}
      <div
        className="bg-gray-700 p-3 rounded-lg flex-grow"
        role="radiogroup"
        aria-required="true"
        aria-invalid={!!error}
        aria-label="CC1 awareness"
      >
        {/* REDUCED margin-bottom */}
        <h3 className="text-white text-xl sm:text-2xl font-extrabold mb-3">
          CC1{" "}
          <span className="font-normal">
            Which of the following best describes your awareness of a CC?
          </span>
        </h3>

        {/* This is where the new radio button implementation goes */}
        {/* REDUCED space-y-3 to space-y-2 */}
        <div className="radio-input-wrapper space-y-2">
          {cc1Options.map((option) => (
            <label
              // REDUCED padding from p-3 to p-2 sm:p-2.5
              // UPDATED bg-gray-600 and hover/checked states
              className="label group flex items-center w-full cursor-pointer bg-gray-600 p-2 sm:p-2.5 rounded-lg border-2 border-gray-600 transition-all duration-200 ease-in-out hover:bg-gray-700 has-[:checked]:border-blue-600 has-[:checked]:bg-gray-700"
              key={option.value}
            >
              <input
                type="radio"
                name="cc1"
                id={`cc1-${option.value}`}
                className="radio-input peer opacity-0 absolute w-0 h-0"
                value={option.value}
                checked={selected === option.value}
                onChange={() => handleSelection(option.value)}
                required
              />
              {/* The custom visible radio button */}
              {/* UPDATED default bg and peer-checked state */}
              <div className="radio-design w-5 h-5 rounded-full bg-gray-600 border-2 border-gray-400 relative mr-3 flex-shrink-0 transition-all duration-200 ease-in-out group-hover:border-gray-100 peer-checked:border-blue-600 peer-checked:bg-gray-700">
                {/* Inner dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-red-600 hidden peer-checked:block"></div>
              </div>
              {/* The label text */}
              <div className="label-text text-white text-base sm:text-lg">
                {option.label}
              </div>
            </label>
          ))}
        </div>
        {/* End of new radio button implementation */}

        {/* REDUCED margin-top */}
        {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
      </div>

      {/* Back and Next Buttons - REDUCED margin-top and button padding/text */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={onBack}
          disabled={!onBack}
          className={`
            px-5 py-1.5 sm:py-2 text-sm font-bold 
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
          disabled={!selected}
          aria-disabled={!selected}
          className={`
            px-6 py-1.5 sm:py-2 text-sm font-extrabold 
            sm:px-8 sm:text-base
            bg-red-600 text-white rounded-full 
            hover:bg-red-700 transition duration-150 shadow-lg 
            uppercase tracking-wide cursor-pointer
            ${!selected ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SurveyQuestionCC1;
