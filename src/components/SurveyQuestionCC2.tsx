import React, { useState } from "react";

// Data for the radio options
const cc2Options = [
  { value: "1", label: "1. Easy to see" },
  { value: "2", label: "2. Somewhat easy to see" },
  { value: "3", label: "3. Difficult to see" },
  { value: "4", label: "4. Not visible at all" },
  { value: "5", label: "5. Not Applicable" },
];

interface SurveyQuestionCC2Props {
  onNext: () => void;
  onBack: () => void;
  // You'll need to add a state handler for this component,
  // similar to CC1, to pass the selected value.
  // For this refactor, I'm just fixing the CSS.
}

const SurveyQuestionCC2: React.FC<SurveyQuestionCC2Props> = ({
  onNext,
  onBack,
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const handleSelection = (value: string) => {
    setSelected(value);
    setTouched(true);
  };

  return (
    // Main Container:
    // REDUCED: Padding from p-4 to p-3 (mobile) and up.
    <div
      className="
      relative w-full flex flex-col justify-between 
      bg-gray-800 rounded-xl shadow-2xl
      p-3 sm:p-5 md:p-6
    "
    >
      {/* Top section with sliders - REDUCED: padding and margin. CHANGED: bg-gray-700 to bg-gray-600 */}
      <div className="mb-3 p-3 bg-gray-600 rounded-lg shadow-inner">
        <div className="flex items-center justify-center space-x-4 m-1 mb-3">
          <div className="relative flex-grow h-2 bg-gray-500 rounded-full">
            {/* Slider track - Current (CC2) is in the middle */}
            <div
              className="absolute h-full bg-red-600 rounded-full"
              style={{ width: "50%" }}
            ></div>{" "}
            {/* Indicate CC2 progress */}
            <div
              className="absolute -ml-2 w-5 h-5 bg-red-600 rounded-full shadow border-2 border-red-600 cursor-pointer"
              style={{ left: "10%" }}
            ></div>{" "}
            {/* Previous dot */}
            <div
              className="absolute -ml-2 w-5 h-5 bg-red-600 rounded-full shadow border-2 border-red-600 cursor-pointer"
              style={{ left: "50%" }}
            ></div>{" "}
            {/* Current dot */}
            <div
              className="absolute -ml-2 w-5 h-5 bg-white rounded-full shadow border-2 border-gray-400 cursor-pointer"
              style={{ left: "90%" }}
            ></div>{" "}
            {/* Future dot */}
          </div>
        </div>
      </div>

      {/* Instructions - REDUCED: padding and margin */}
      <div className="bg-blue-700 p-3 rounded-lg mb-4">
        <p className="text-white text-base sm:text-lg font-normal leading-relaxed">
          <span className="font-bold">INSTRUCTIONS:</span> Please choose in the
          designated choices that corresponds to your answer on the Citizen's
          Charter (CC) questions. The Citizen's Charter is an official document
          that reflects the services of a government agency/office including its
          requirements, fees, and processing times among others.
        </p>
      </div>

      {/* Question CC2 - REDUCED: padding. CHANGED: bg-gray-700 to bg-gray-600 */}
      <div
        className="bg-gray-700 p-3 rounded-lg flex-grow"
        role="radiogroup"
        aria-required="true"
        aria-invalid={touched && !selected}
      >
        {/* REDUCED: margin-bottom */}
        <h3 className="text-white text-xl sm:text-2xl font-extrabold mb-3">
          CC2{" "}
          <span className="font-normal">
            If aware of CC (answered 1-3 in CC1), would you say that the CC of
            this office was...?
          </span>
        </h3>
        {/* REDUCED: space-y-3 to space-y-2 */}
        <div className="radio-input-wrapper space-y-2">
          {cc2Options.map((option) => (
            <label
              // REDUCED: padding from p-3 to p-2. CHANGED: bg-gray-600 to bg-gray-500
              className="label group flex items-center w-full cursor-pointer bg-gray-600 p-2 sm:p-2.5 rounded-lg border-2 border-gray-600 transition-all duration-200 ease-in-out hover:bg-gray-700 has-[:checked]:border-blue-600 has-[:checked]:bg-gray-700"
              key={option.value}
            >
              <input
                type="radio"
                name="cc2"
                id={`cc2-${option.value}`}
                className="radio-input peer opacity-0 absolute w-0 h-0"
                value={option.value}
                checked={selected === option.value}
                onChange={() => handleSelection(option.value)}
                required
              />
              {/* The custom visible radio button - CHANGED: bg-gray-600 to bg-gray-500 */}
              <div className="radio-design w-5 h-5 rounded-full bg-gray-500 border-2 border-gray-400 relative mr-3 flex-shrink-0 transition-all duration-200 ease-in-out group-hover:border-gray-100 peer-checked:border-blue-600 peer-checked:bg-gray-700">
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

        {/* REDUCED: margin-top */}
        {touched && !selected && (
          <p className="text-red-300 mt-2 text-sm" role="alert">
            Please select an option before continuing.
          </p>
        )}
      </div>

      {/* Navigation Buttons - REDUCED: margin-top and button padding/text */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={onBack}
          className="
            px-5 py-1.5 sm:py-2 text-sm font-bold 
            sm:px-6 sm:text-base 
            bg-gray-500 text-white rounded-full 
            hover:bg-gray-600 transition duration-150 shadow-sm 
            uppercase tracking-wide cursor-pointer
          "
        >
          Back
        </button>
        <button
          onClick={() => {
            setTouched(true);
            if (selected) {
              onNext();
            }
          }}
          disabled={!selected}
          className={`
            px-6 py-1.5 sm:py-2 text-sm font-extrabold 
            sm:px-8 sm:text-base
            bg-red-600 text-white rounded-full 
            hover:bg-red-700 transition duration-150 shadow-lg 
            uppercase tracking-wide cursor-pointer
            ${!selected ? "opacity-50 cursor-not-allowed hover:bg-red-600" : ""}
          `}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SurveyQuestionCC2;
