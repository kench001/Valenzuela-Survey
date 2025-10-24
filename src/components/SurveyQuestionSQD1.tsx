import React, { useState } from "react";
import type { ReactNode } from "react"; // Added this type import

// --- Styled-components and SVG definitions ---

// Use the new SVG definitions you provided
const SvgDefinitions = () => (
  <svg style={{ display: "none" }} xmlns="http://www.w3.org/2000/svg">
    <symbol id="eye" viewBox="0 0 7 4">
      <path d="M1,1 C1,1 3.5,3 6,1" />
    </symbol>
    <symbol id="mouth" viewBox="0 0 18 7">
      <path d="M1,1 C1,1 9,7 17,1" />
    </symbol>
  </svg>
);

// --- CSS for Emoji Styles ---
// All the styles from styled-components are now in this string
const emojiStylesCSS = `
  .feedback {
    --normal: #414052;
    --normal-shadow: #313140;
    --normal-shadow-top: #4c4b60;
    --normal-mouth: #2e2e3d;
    --normal-eye: #282734;
    --active: #f8da69;
    --active-shadow: #f4b555;
    --active-shadow-top: #fff6d3;
    --active-mouth: #f05136;
    --active-eye: #313036;
    --active-tear: #76b5e7;
    --active-shadow-angry: #e94f1d;
    --hover: #454456;
    --hover-shadow-top: #59586b;
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    /* Added styles for layout */
    justify-content: center; /* Center the items */
    align-items: flex-start;  /* Align to top to account for text */
    flex-wrap: wrap;        /* Allow wrapping on small screens */
    gap: 8px;               /* Replaced margin with gap for better wrapping */
  }
  .feedback label {
    position: relative;
    transition: transform 0.3s;
    cursor: pointer;
    /* Added styles for layout */
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1 1 80px;  /* Added flex properties for responsive sizing */
    max-width: 100px; /* Prevent items from getting too large */
    padding: 0 5px;  /* Add horizontal padding */
  }
  /* Removed .feedback label:not(:last-child) rule, as 'gap' now handles spacing */

  /* Added styles for the text label below the emoji */
  .feedback label span {
    color: white;
    font-size: 0.75rem; /* 12px */
    margin-top: 8px;
    font-weight: 500;
    text-align: center;
    white-space: normal;
    width: 100%;
    line-height: 1.2;
  }
  .feedback label input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;
    border: none;
    display: block;
    position: absolute;
    width: 40px;
    height: 40px;
    left: 50%; /* Center the input */
    top: 0;
    margin: 0;
    margin-left: -20px; /* Adjust for width */
    padding: 0;
    border-radius: 50%;
    background: var(--sb, var(--normal));
    box-shadow:
      inset 3px -3px 4px var(--sh, var(--normal-shadow)),
      inset -1px 1px 2px var(--sht, var(--normal-shadow-top));
    transition:
      background 0.4s,
      box-shadow 0.4s,
      transform 0.3s;
    -webkit-tap-highlight-color: transparent;
  }
  .feedback label div {
    width: 40px;
    height: 40px;
    position: relative;
    transform: perspective(240px) translateZ(4px);
  }
  .feedback label div svg,
  .feedback label div:before,
  .feedback label div:after {
    display: block;
    position: absolute;
    left: var(--l, 9px);
    top: var(--t, 13px);
    width: var(--w, 8px);
    height: var(--h, 1px);
    transform: rotate(var(--r, 0deg)) scale(var(--sc, 1)) translateZ(0);
  }
  .feedback label div svg {
    fill: none;
    stroke: var(--s);
    stroke-width: 1.5px;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: stroke 0.4s;
  }
  .feedback label div svg.eye {
    --s: var(--e, var(--normal-eye));
    --t: 17px;
    --w: 7px;
    --h: 4px;
    /* Use the SVG symbol */
    width: 7px;
    height: 4px;
    overflow: visible;
  }
  .feedback label div svg.eye.right {
    --l: 23px;
  }
  .feedback label div svg.mouth {
    --s: var(--m, var(--normal-mouth));
    --l: 11px;
    --t: 23px;
    --w: 18px;
    --h: 7px;
     /* Use the SVG symbol */
    width: 18px;
    height: 7px;
    overflow: visible;
  }
  .feedback label div:before,
  .feedback label div:after {
    content: "";
    z-index: var(--zi, 1);
    border-radius: var(--br, 1px);
    background: var(--b, var(--e, var(--normal-eye)));
    transition: background 0.4s;
  }
  .feedback label.angry {
    --step-1-rx: -24deg;
    --step-1-ry: 20deg;
    --step-2-rx: -24deg;
    --step-2-ry: -20deg;
  }
  .feedback label.angry div:before {
    --r: 20deg;
  }
  .feedback label.angry div:after {
    --l: 23px;
    --r: -20deg;
  }
  .feedback label.angry div svg.eye {
    /* Removed stroke-dasharray and stroke-dashoffset as they don't match new SVG */
  }
  .feedback label.angry input:checked {
    -webkit-animation: angry 1s linear;
    animation: angry 1s linear;
  }
  .feedback label.angry input:checked + div:before {
    --middle-y: -2px;
    --middle-r: 22deg;
    -webkit-animation: toggle 0.8s linear forwards;
    animation: toggle 0.8s linear forwards;
  }
  .feedback label.angry input:checked + div:after {
    --middle-y: 1px;
    --middle-r: -18deg;
    -webkit-animation: toggle 0.8s linear forwards;
    animation: toggle 0.8s linear forwards;
  }
  .feedback label.sad {
    --step-1-rx: 20deg;
    --step-1-ry: -12deg;
    --step-2-rx: -18deg;
    --step-2-ry: 14deg;
  }
  .feedback label.sad div:before,
  .feedback label.sad div:after {
    --b: var(--active-tear);
    --sc: 0;
    --w: 5px;
    --h: 5px;
    --t: 15px;
    --br: 50%;
  }
  .feedback label.sad div:after {
    --l: 25px;
  }
  .feedback label.sad div svg.eye {
    --t: 16px;
  }
  .feedback label.sad div svg.mouth {
    --t: 24px;
    /* Removed stroke-dasharray and stroke-dashoffset as they don't match new SVG */
  }
  .feedback label.sad input:checked + div:before,
  .feedback label.sad input:checked + div:after {
    -webkit-animation: tear 0.6s linear forwards;
    animation: tear 0.6s linear forwards;
  }
  .feedback label.ok {
    --step-1-rx: 4deg;
    --step-1-ry: -22deg;
    --step-1-rz: 6deg;
    --step-2-rx: 4deg;
    --step-2-ry: 22deg;
    --step-2-rz: -6deg;
  }
  .feedback label.ok div:before {
    --l: 12px;
    --t: 17px;
    --h: 4px;
    --w: 4px;
    --br: 50%;
    box-shadow: 12px 0 0 var(--e, var(--normal-eye));
  }
  .feedback label.ok div:after {
    --l: 13px;
    --t: 26px;
    --w: 14px;
    --h: 2px;
    --br: 1px;
    --b: var(--m, var(--normal-mouth));
  }
  .feedback label.ok input:checked + div:before {
    --middle-s-y: 0.35;
    -webkit-animation: toggle 0.2s linear forwards;
    animation: toggle 0.2s linear forwards;
  }
  .feedback label.ok input:checked + div:after {
    --middle-s-x: 0.5;
    -webkit-animation: toggle 0.7s linear forwards;
    animation: toggle 0.7s linear forwards;
  }
  /* --- ADDED NEW 'na' STYLE HERE --- */
  .feedback label.na {
    --step-1-rx: 4deg;
    --step-1-ry: -22deg;
    --step-1-rz: 6deg;
    --step-2-rx: 4deg;
    --step-2-ry: 22deg;
    --step-2-rz: -6deg;
  }
  .feedback label.na div:before {
    --l: 12px;
    --t: 17px;
    --h: 4px;
    --w: 4px;
    --br: 50%;
    box-shadow: 12px 0 0 var(--e, var(--normal-eye));
  }
  .feedback label.na div:after {
    --l: 15px; /* Centered */
    --t: 26px;
    --w: 10px; /* Shorter mouth */
    --h: 2px;
    --br: 1px;
    --b: var(--m, var(--normal-mouth));
  }
  .feedback label.na input:checked + div:before {
    --middle-s-y: 0.35;
    -webkit-animation: toggle 0.2s linear forwards;
    animation: toggle 0.2s linear forwards;
  }
  .feedback label.na input:checked + div:after {
    --middle-s-x: 0.5;
    -webkit-animation: toggle 0.7s linear forwards;
    animation: toggle 0.7s linear forwards;
  }
  /* --- END OF NEW 'na' STYLE --- */
  .feedback label.good {
    --step-1-rx: -14deg;
    --step-1-rz: 10deg;
    --step-2-rx: 10deg;
    --step-2-rz: -8deg;
  }
  .feedback label.good div:before {
    --b: var(--m, var(--normal-mouth));
    --w: 5px;
    --h: 5px;
    --br: 50%;
    --t: 22px;
    --zi: 0;
    opacity: 0.5;
    box-shadow: 16px 0 0 var(--b);
    filter: blur(2px);
  }
  .feedback label.good div:after {
    --sc: 0;
  }
  .feedback label.good div svg.eye {
    --t: 15px;
    --sc: -1;
    /* Removed stroke-dasharray and stroke-dashoffset as they don't match new SVG */
  }
  .feedback label.good div svg.mouth {
    --t: 22px;
    --sc: -1;
    /* Removed stroke-dasharray and stroke-dashoffset as they don't match new SVG */
  }
  .feedback label.good input:checked + div svg.mouth {
    --middle-y: 1px;
    --middle-s: -1;
    -webkit-animation: toggle 0.8s linear forwards;
    animation: toggle 0.8s linear forwards;
  }
  .feedback label.happy {
    --step-1-rx: 18deg;
    --step-1-ry: 24deg;
    --step-2-rx: 18deg;
    --step-2-ry: -24deg;
  }
  .feedback label.happy div:before {
    --sc: 0;
  }
  .feedback label.happy div:after {
    --b: var(--m, var(--normal-mouth));
    --l: 11px;
    --t: 23px;
    --w: 18px;
    --h: 8px;
    --br: 0 0 8px 8px;
  }
  .feedback label.happy div svg.eye {
    --t: 14px;
    --sc: -1;
  }
  .feedback label.happy input:checked + div:after {
    --middle-s-x: 0.95;
    --middle-s-y: 0.75;
    -webkit-animation: toggle 0.8s linear forwards;
    animation: toggle 0.8s linear forwards;
  }
  .feedback label input:checked {
    --sb: var(--active);
    --sh: var(--active-shadow);
    --sht: var(--active-shadow-top);
  }
  .feedback label input:checked + div {
    --m: var(--active-mouth);
    --e: var(--active-eye);
    -webkit-animation: shake 0.8s linear forwards;
    animation: shake 0.8s linear forwards;
  }
  .feedback label input:not(:checked):hover {
    --sb: var(--hover);
    --sht: var(--hover-shadow-top);
  }
  .feedback label input:not(:checked):active {
    transform: scale(0.925);
  }
  .feedback label input:not(:checked):active + div {
    transform: scale(0.925);
  }
  .feedback label:hover {
    transform: scale(1.08);
  }

  /* ... (All keyframes: shake, tear, toggle, angry) ... */
  @-webkit-keyframes shake {
    30% {
      transform: perspective(240px) rotateX(var(--step-1-rx, 0deg))
        rotateY(var(--step-1-ry, 0deg)) rotateZ(var(--step-1-rz, 0deg))
        translateZ(10px);
    }
    60% {
      transform: perspective(240px) rotateX(var(--step-2-rx, 0deg))
        rotateY(var(--step-2-ry, 0deg)) rotateZ(var(--step-2-rz, 0deg))
        translateZ(10px);
    }
    100% {
      transform: perspective(240px) translateZ(4px);
    }
  }

  @keyframes shake {
    30% {
      transform: perspective(240px) rotateX(var(--step-1-rx, 0deg))
        rotateY(var(--step-1-ry, 0deg)) rotateZ(var(--step-1-rz, 0deg))
        translateZ(10px);
    }
    60% {
      transform: perspective(240px) rotateX(var(--step-2-rx, 0deg))
        rotateY(var(--step-2-ry, 0deg)) rotateZ(var(--step-2-rz, 0deg))
        translateZ(10px);
    }
    100% {
      transform: perspective(240px) translateZ(4px);
    }
  }
  @-webkit-keyframes tear {
    0% {
      opacity: 0;
      transform: translateY(-2px) scale(0) translateZ(0);
    }
    50% {
      transform: translateY(12px) scale(0.6, 1.2) translateZ(0);
    }
    20%,
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(24px) translateX(4px) rotateZ(-30deg) scale(0.7, 1.1)
        translateZ(0);
    }
  }
  @keyframes tear {
    0% {
      opacity: 0;
      transform: translateY(-2px) scale(0) translateZ(0);
    }
    50% {
      transform: translateY(12px) scale(0.6, 1.2) translateZ(0);
    }
    20%,
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(24px) translateX(4px) rotateZ(-30deg) scale(0.7, 1.1)
        translateZ(0);
    }
  }
  @-webkit-keyframes toggle {
    50% {
      transform: translateY(var(--middle-y, 0))
        scale(
          var(--middle-s-x, var(--middle-s, 1)),
          var(--middle-s-y, var(--middle-s, 1))
        )
        rotate(var(--middle-r, 0deg));
    }
  }
  @keyframes toggle {
    50% {
      transform: translateY(var(--middle-y, 0))
        scale(
          var(--middle-s-x, var(--middle-s, 1)),
          var(--middle-s-y, var(--middle-s, 1))
        )
        rotate(var(--middle-r, 0deg));
    }
  }
  @-webkit-keyframes angry {
    40% {
      background: var(--active);
    }
    45% {
      box-shadow:
        inset 3px -3px 4px var(--active-shadow),
        inset 0 8px 10px var(--active-shadow-angry);
    }
  }
  @keyframes angry {
    40% {
      background: var(--active);
    }
    45% {
      box-shadow:
        inset 3px -3px 4px var(--active-shadow),
        inset 0 8px 10px var(--active-shadow-angry);
    }
  }
`;

// This component injects the styles into the document head
const EmojiStyles = () => <style>{emojiStylesCSS}</style>;

// --- Component Props and Data ---

interface Props {
  onNext?: () => void; // legacy single-callback (no answers)
  onBack?: () => void;
  onFinish?: (answers: Record<string, string>) => void; // now receives answers
  onCancel?: () => void;
  startIndex?: number;
}

const questions = [
  // ... (Your questions array remains unchanged)
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

// Update the EmojiOption interface
interface EmojiOption {
  class: string;
  svg: ReactNode; // Changed from ReactElement to ReactNode
}

// --- HELPER COMPONENTS FOR EMOJI FACES ---
// Created these helpers to reduce repetition in the map below
const FullEmojiFace = () => (
  <>
    <svg className="eye left">
      <use href="#eye" />
    </svg>
    <svg className="eye right">
      <use href="#eye" />
    </svg>
    <svg className="mouth">
      <use href="#mouth" />
    </svg>
  </>
);

const HappyEmojiFace = () => (
  <>
    <svg className="eye left">
      <use href="#eye" />
    </svg>
    <svg className="eye right">
      <use href="#eye" />
    </svg>
  </>
);
// --- END HELPER COMPONENTS ---

// Define the optionToEmoji mapping
// This is now shorter and more readable using the helper components
const optionToEmoji: Record<string, EmojiOption> = {
  "Strongly Disagree": {
    class: "angry",
    svg: <FullEmojiFace />,
  },
  Disagree: {
    // Ensured key is a string
    class: "good", // Swapped with Agree
    svg: <FullEmojiFace />,
  },
  "Neither Agree nor Disagree": {
    class: "ok",
    svg: <div />, // 'ok' uses pseudo-elements
  },
  Agree: {
    // Ensured key is a string
    class: "sad", // Swapped with Disagree
    svg: <FullEmojiFace />,
  },
  "Strongly Agree": {
    class: "happy",
    svg: <HappyEmojiFace />,
  },
  "N/A": {
    class: "na",
    svg: <div />, // 'na' uses pseudo-elements
  },
};

// --- Main Survey Component ---

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

  // Defines the desired display order for the emojis
  const displayOrder = [
    "Strongly Agree",
    "Agree",
    "Neither Agree nor Disagree",
    "Disagree",
    "Strongly Disagree",
    "N/A",
  ];

  // Create the list of options in the new display order
  const emojiOptions = displayOrder.filter(
    (opt) => current.options.includes(opt) && optionToEmoji[opt]
  );

  const naOption = current.options.find((opt) => !optionToEmoji[opt]); // e.g., "N/A"
  // ^ This naOption will now be undefined, as "N/A" is in optionToEmoji.
  // This is correct, as it will now be rendered by the emojiOptions.map() instead.

  const handleOptionChange = (value: string) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
    if (error) setError("");
  };

  const handleNextClick = () => {
    // Check for an answer on the current question before proceeding
    if (!showFinalInputs && !answers[current.id]) {
      setError("Please select an option to continue.");
      return;
    }

    // If on the last question, show the final inputs screen
    if (currentIndex === total - 1 && !showFinalInputs) {
      setShowFinalInputs(true);
      return;
    }

    // If on the final screen, submit the survey
    if (showFinalInputs) {
      const finalAnswers = { ...answers, suggestion, email };
      if (onFinish) {
        onFinish(finalAnswers);
      } else if (onNext) {
        onNext(); // Fallback for legacy prop
      }
      return;
    }

    // Otherwise, just go to the next question
    setCurrentIndex((i) => i + 1);
  };

  const handleBackClick = () => {
    // If on the final screen, go back to the last question
    if (showFinalInputs) {
      setShowFinalInputs(false);
      return;
    }

    // If on the first question, trigger the parent's back/cancel action
    if (currentIndex === 0) {
      if (onBack) onBack();
      else if (onCancel) onCancel(); // Fallback
      return;
    }

    // Otherwise, go to the previous question
    setCurrentIndex((i) => i - 1);
  };

  return (
    // Main Container
    <div
      className="
      relative w-full flex flex-col justify-between 
      bg-gray-800 rounded-xl shadow-2xl
      p-4 sm:p-6 md:p-8
    "
    >
      {/* Add SVG definitions to the DOM */}
      <SvgDefinitions />
      {/* Add the CSS styles to the DOM */}
      <EmojiStyles />

      {/* Progress Bar */}
      <div className="mb-4 p-4 bg-gray-700 rounded-lg shadow-inner">
        <div className="flex items-center justify-center m-1">
          <div className="relative flex-grow h-2 bg-gray-500 rounded-full">
            <div
              className={`absolute h-full rounded-full transition-all duration-300 ${
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

      {/* Instructions */}
      {!showFinalInputs && (
        <div className="bg-blue-700 p-4 rounded-lg mb-6">
          <p className="text-white text-base sm:text-lg font-normal leading-relaxed">
            INSTRUCTIONS: Please choose on the option that best corresponds to
            your answer.
          </p>
        </div>
      )}

      {/* Main Content: Switches between Questions and Final Inputs */}
      {!showFinalInputs ? (
        // Question Section - REPLACED with Emoji buttons
        <div className="bg-gray-600 p-4 sm:p-5 rounded-md flex-grow mb-6">
          <h3 className="text-white text-lg sm:text-xl md:text-2xl font-extrabold mb-6">
            {current.id}: {current.text}
          </h3>

          {/* New Emoji Radio Buttons */}
          {/* Replaced <StyledWrapper> with a simple <div> */}
          <div>
            <div className="feedback">
              {/* This map now renders the emojis in the correct displayOrder */}
              {emojiOptions.map((opt) => {
                const emoji = optionToEmoji[opt];
                if (!emoji) return null; // Should not happen based on filter

                // REVERTED this JSX to the original, working version
                return (
                  <label key={opt} className={emoji.class}>
                    <input
                      type="radio"
                      name={current.id}
                      value={opt}
                      checked={answers[current.id] === opt}
                      onChange={() => handleOptionChange(opt)}
                      required
                    />
                    {/* This div is the clickable face */}
                    <div>{emoji.svg}</div>
                    {/* This span is the text label below */}
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Standard Radio for N/A */}
          {naOption && (
            <div className="mt-8 flex justify-center">
              {" "}
              {/* Center N/A option */}
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name={current.id}
                  value={naOption}
                  checked={answers[current.id] === naOption}
                  onChange={() => handleOptionChange(naOption)}
                  className="form-radio h-5 w-5 text-red-600 bg-gray-700 border-gray-500"
                  required
                />
                <span className="ml-3 text-white text-base sm:text-lg">
                  {naOption}
                </span>
              </label>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-400 mt-4 font-medium text-center">
              {error}
            </p>
          )}
        </div>
      ) : (
        // Final Inputs Section - Unchanged
        <div className="bg-gray-600 p-4 sm:p-5 rounded-md flex-grow mb-6">
          <h3 className="text-white text-lg sm:text-xl md:text-2xl font-extrabold mb-4">
            Suggestions on how we can further improve our services (optional):
          </h3>
          <textarea
            className="w-full p-3 rounded-md bg-gray-700 text-white text-base border border-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 mb-6"
            rows={5}
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="Type your suggestions here..."
          />
          <h3 className="text-white text-lg sm:text-xl md:text-2xl font-extrabold mb-4">
            Email address (optional):
          </h3>
          <input
            type="email"
            className="w-full p-3 rounded-md bg-gray-700 text-white text-base border border-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@example.com"
          />
        </div>
      )}

      {/* Navigation Buttons - Unchanged */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBackClick}
          className="
            px-5 py-2 text-sm font-bold 
            sm:px-6 sm:text-base 
            bg-gray-500 text-white rounded-full 
            hover:bg-gray-600 transition duration-150 shadow-sm 
            uppercase tracking-wide cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          disabled={currentIndex === 0 && !showFinalInputs}
        >
          {/* Change text to Cancel on the very first question */}
          {currentIndex === 0 && !showFinalInputs ? "Back" : "Back"}
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleNextClick}
            className="
              px-6 py-2 text-base font-extrabold 
              sm:px-8 sm:text-lg
              bg-red-600 text-white rounded-full 
              hover:bg-red-700 transition duration-150 shadow-lg 
              uppercase tracking-wide cursor-pointer
            "
          >
            {showFinalInputs ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyQuestionSQD1;
