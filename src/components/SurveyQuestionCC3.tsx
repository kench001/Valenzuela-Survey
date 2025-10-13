import React from "react";

interface SurveyQuestionCC3Props {
  onNext: () => void;
  onBack: () => void;
}

const SurveyQuestionCC3: React.FC<SurveyQuestionCC3Props> = ({
  onNext,
  onBack,
}) => {
  return (
    <div className="relative p-6 sm:p-8 md:p-10 bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl mx-auto my-auto flex flex-col justify-between h-auto max-h-full overflow-y-auto">
      {/* Top section with sliders - Red indicating current position */}
      <div className="mb-1 p-4 bg-gray-700 rounded-lg shadow-inner">
        <div className="flex items-center justify-center space-x-4 m-1 mb-4">
          <div className="relative flex-grow h-2 bg-gray-500 rounded-full">
            {/* Slider track - Current (CC3) is at the end */}
            <div
              className="absolute h-full bg-red-600 rounded-full"
              style={{ width: "90%" }}
            ></div>{" "}
            {/* Indicate CC3 progress */}
            <div
              className="absolute -ml-2 w-5 h-5 bg-red-600 rounded-full shadow border-2 border-red-600 cursor-pointer"
              style={{ left: "10%" }}
            ></div>{" "}
            {/* Previous dot */}
            <div
              className="absolute -ml-2 w-5 h-5 bg-red-600 rounded-full shadow border-2 border-red-600 cursor-pointer"
              style={{ left: "50%" }}
            ></div>{" "}
            {/* Previous dot */}
            <div
              className="absolute -ml-2 w-5 h-5 bg-red-600 rounded-full shadow border-2 border-red-600 cursor-pointer"
              style={{ left: "90%" }}
            ></div>{" "}
            {/* Current dot */}
          </div>
        </div>
      </div>

      {/* Instructions */}
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

      {/* Question CC3 */}
      <div className="bg-gray-600 p-4 rounded-lg flex-grow">
        <h3 className="text-white text-xl sm:text-2xl font-extrabold mb-4">
          CC3{" "}
          <span className="font-normal">
            If aware of CC (answered codes 1-3 in CC1) how much did the CC help
            you in your transaction?
          </span>
        </h3>
        <div className="space-y-3">
          <label className="inline-flex items-center w-full">
            <input
              type="radio"
              name="cc3"
              className="form-radio h-5 w-5 text-red-600 bg-gray-700 border-gray-500"
              value="1"
            />
            <span className="ml-3 text-white text-base sm:text-lg">
              1. Helped very much
            </span>
          </label>
          <label className="inline-flex items-center w-full">
            <input
              type="radio"
              name="cc3"
              className="form-radio h-5 w-5 text-red-600 bg-gray-700 border-gray-500"
              value="2"
            />
            <span className="ml-3 text-white text-base sm:text-lg">
              2. Somewhat helped
            </span>
          </label>
          <label className="inline-flex items-center w-full">
            <input
              type="radio"
              name="cc3"
              className="form-radio h-5 w-5 text-red-600 bg-gray-700 border-gray-500"
              value="3"
            />
            <span className="ml-3 text-white text-base sm:text-lg">
              3. Did not help
            </span>
          </label>
          <label className="inline-flex items-center w-full">
            <input
              type="radio"
              name="cc3"
              className="form-radio h-5 w-5 text-red-600 bg-gray-700 border-gray-500"
              value="4"
            />
            <span className="ml-3 text-white text-base sm:text-lg">
              4. Not Applicable
            </span>
          </label>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={onBack}
          className="px-8 py-2 bg-gray-600 text-white font-extrabold text-xl rounded-full hover:bg-gray-700 transition duration-150 shadow-lg uppercase tracking-wide cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={onNext} // This could be "Submit" or "Finish" for the last question
          className="px-8 py-2 bg-red-600 text-white font-extrabold text-xl rounded-full hover:bg-red-700 transition duration-150 shadow-lg uppercase tracking-wide cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SurveyQuestionCC3;
