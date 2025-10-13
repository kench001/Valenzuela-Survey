import React, { useState } from "react";

interface Props {
  onNext?: () => void; // legacy single-callback (no answers)
  onBack?: () => void;
  onFinish?: (answers: Record<string, string>) => void; // now receives answers
  onCancel?: () => void;
  startIndex?: number;
}

const questions = [
  {
    id: "SQD0",
    text: "I am satisfied with the service that I availed.",
    options: [
      "Strongly Disagree",
      "Disagree",
      "Neither Agree nor Disagree",
      "Agree",
      "Strongly Agree",
      "N/A",
    ],
  },
  {
    id: "SQD1",
    text: "I spent a reasonable amount of time for my transaction.",
    options: [
      "Strongly Disagree",
      "Disagree",
      "Neither Agree nor Disagree",
      "Agree",
      "Strongly Agree",
      "N/A",
    ],
  },
  {
    id: "SQD2",
    text: "The office followed the transaction's requirements and steps based on the information provided.",
    options: [
      "Strongly Disagree",
      "Disagree",
      "Neither Agree nor Disagree",
      "Agree",
      "Strongly Agree",
      "N/A",
    ],
  },
  {
    id: "SQD3",
    text: "The staff were courteous and professional.",
    options: [
      "Strongly Disagree",
      "Disagree",
      "Neither Agree nor Disagree",
      "Agree",
      "Strongly Agree",
      "N/A",
    ],
  },
  {
    id: "SQD4",
    text: "The facilities were clean and organized.",
    options: [
      "Strongly Disagree",
      "Disagree",
      "Neither Agree nor Disagree",
      "Agree",
      "Strongly Agree",
      "N/A",
    ],
  },
  {
    id: "SQD5",
    text: "The process was easy to understand.",
    options: [
      "Strongly Disagree",
      "Disagree",
      "Neither Agree nor Disagree",
      "Agree",
      "Strongly Agree",
      "N/A",
    ],
  },
  {
    id: "SQD6",
    text: "I received the service I needed without unnecessary delays.",
    options: [
      "Strongly Disagree",
      "Disagree",
      "Neither Agree nor Disagree",
      "Agree",
      "Strongly Agree",
      "N/A",
    ],
  },
  {
    id: "SQD7",
    text: "I am confident in the accuracy of the information provided.",
    options: [
      "Strongly Disagree",
      "Disagree",
      "Neither Agree nor Disagree",
      "Agree",
      "Strongly Agree",
      "N/A",
    ],
  },
  {
    id: "SQD8",
    text: "Overall, I am satisfied with the service provided.",
    options: [
      "Strongly Disagree",
      "Disagree",
      "Neither Agree nor Disagree",
      "Agree",
      "Strongly Agree",
      "N/A",
    ],
  },
];

const SurveyQuestionSQD1: React.FC<Props> = ({
  onNext,
  onBack,
  onFinish,
  onCancel,
  startIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(startIndex);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");
  const [showFinalInputs, setShowFinalInputs] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const current = questions[currentIndex];
  const total = questions.length;

  const handleOptionChange = (value: string) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
    if (error) setError("");
  };

  const handleNext = () => {
    if (!showFinalInputs && !answers[current.id]) {
      setError("Please select an option to continue.");
      return;
    }

    if (currentIndex === total - 1 && !showFinalInputs) {
      setShowFinalInputs(true);
      return;
    }

    if (showFinalInputs) {
      // final submit: prefer onFinish(answers) so parent gets data
      if (onFinish) {
        onFinish({ ...answers, suggestion, email });
      } else if (onNext) {
        onNext();
      }
      return;
    }

    setCurrentIndex((i) => i + 1);
  };

  const handleBack = () => {
    if (showFinalInputs) {
      setShowFinalInputs(false);
      return;
    }

    if (currentIndex === 0) {
      if (onBack) onBack();
      else if (onCancel) onCancel();
      return;
    }
    setCurrentIndex((i) => i - 1);
  };

  return (
    <div className="relative p-6 sm:p-8 md:p-10 bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl mx-auto my-auto flex flex-col justify-between h-auto max-h-full overflow-y-auto">
      <div className="mb-1 p-4 bg-gray-700 rounded-lg shadow-inner">
        <div className="flex items-center justify-center m-1 mb-4">
          <div className="relative flex-grow h-2 bg-gray-500 rounded-full">
            <div
              className={`absolute h-full rounded-full ${
                showFinalInputs ? "bg-green-500" : "bg-red-600"
              }`}
              style={{
                width: `${
                  showFinalInputs ? 100 : ((currentIndex + 1) / total) * 100
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      {!showFinalInputs && (
        <div className="bg-blue-700 p-4 rounded-lg mb-6">
          <p className="text-white text-base sm:text-lg font-normal leading-relaxed">
            INSTRUCTIONS: Please put a check mark (✓) on the option that best
            corresponds to your answer.
          </p>
        </div>
      )}

      {!showFinalInputs ? (
        <div className="bg-gray-600 p-5 rounded-md flex-grow mb-6">
          <h3 className="text-white text-xl sm:text-2xl font-extrabold mb-4">
            {current.id}: {current.text}
          </h3>

          <fieldset>
            <div className="space-y-3">
              {current.options.map((opt, idx) => (
                <label key={idx} className="inline-flex items-center w-full">
                  <input
                    type="radio"
                    name={current.id}
                    value={opt}
                    checked={answers[current.id] === opt}
                    onChange={() => handleOptionChange(opt)}
                    className="form-radio h-5 w-5 text-red-600 bg-gray-700 border-gray-500"
                    required
                  />
                  <span className="ml-3 text-white text-base sm:text-lg">
                    {opt}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {error && (
            <p className="text-sm text-red-400 mt-4 font-medium">{error}</p>
          )}
        </div>
      ) : (
        <div className="bg-gray-600 p-5 rounded-md flex-grow mb-6">
          <h3 className="text-white text-xl sm:text-2xl font-extrabold mb-4">
            Suggestions on how we can further improve our services (optional):
          </h3>
          <textarea
            className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 mb-6"
            rows={5}
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="Type your suggestions here..."
          />

          <h3 className="text-white text-xl sm:text-2xl font-extrabold mb-4">
            Email address (optional):
          </h3>
          <input
            type="email"
            className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@example.com"
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className={`px-5 py-2 rounded-full font-semibold ${
            currentIndex === 0 && !showFinalInputs
              ? "bg-gray-500 text-white opacity-80"
              : "bg-gray-500 text-white hover:bg-gray-600"
          }`}
          aria-disabled={currentIndex === 0 && !showFinalInputs}
        >
          {currentIndex === 0 && !showFinalInputs ? "Cancel" : "Back"}
        </button>

        <div className="flex items-center gap-3">
          {!showFinalInputs && (
            <div className="text-sm text-gray-300 hidden sm:block">
              {answers[current.id] ? answers[current.id] : "No answer yet"}
            </div>
          )}

          <button
            onClick={handleNext}
            className="px-6 py-2 bg-red-600 text-white font-extrabold rounded-full hover:bg-red-700 transition"
          >
            {showFinalInputs
              ? "Submit"
              : currentIndex === total - 1
              ? "Next"
              : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyQuestionSQD1;
