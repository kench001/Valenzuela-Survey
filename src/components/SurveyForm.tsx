import React, { useState } from "react";
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import SurveyQuestionCC1 from "./SurveyQuestionCC1";
import SurveyQuestionCC2 from "./SurveyQuestionCC2";
import SurveyQuestionCC3 from "./SurveyQuestionCC3";
import SurveyQuestionSQD1 from "./SurveyQuestionSQD1";
import ThankYouPage from "./ThankYouPage";

const InitialSurveyDetails: React.FC<{ onNext: (demographics: any) => void }> = ({ onNext }) => {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    clientType: "",
    date: "",
    sex: "",
    age: "",
    region: "",
    service: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.clientType) newErrors.clientType = "Please select client type.";
    if (!form.date) newErrors.date = "Please select a date.";
    if (!form.sex) newErrors.sex = "Please select sex.";
    if (!form.age) newErrors.age = "Please select age range.";
    if (!form.region || !form.region.trim())
      newErrors.region = "Please enter region.";
    if (!form.service || !form.service.trim())
      newErrors.service = "Please describe the service.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLocalNext = () => {
    if (validate()) onNext(form);
    else {
      // Find the first element with an error and focus it
      const firstKey = Object.keys(errors)[0];
      if (firstKey) {
        (
          document.querySelector(`[name="${firstKey}"]`) as HTMLElement
        )?.focus();
      }
    }
  };

  return (
    // This is the main "card".
    // REMOVED: max-h-[85vh] and overflow-y-auto to prevent internal scrolling.
    // The page itself will scroll if needed, which is correct.
    // REDUCED: Padding from p-4 to p-3 (mobile) and up.
    <div
      className="
      relative w-full h-auto
      flex flex-col justify-between 
      bg-gray-800 shadow-2xl 
      p-3 sm:p-5 md:p-6 
      rounded-lg sm:rounded-xl
    "
    >
      {/* REDUCED: Spacing from space-y-3 to space-y-2 (mobile) and up. */}
      <div className="space-y-2 sm:space-y-4 md:space-y-5 flex-grow">
        {/* Client Type */}
        {/* REDUCED: Padding from p-3 to p-2 (mobile) and up. */}
        <div className="bg-gray-600 p-2 sm:p-3 rounded-lg">
          {/* REDUCED: Margin from mb-2 to mb-1.5 */}
          <label className="block text-white text-sm sm:text-base md:text-lg font-bold mb-1.5">
            Client Type:
          </label>
          <div className="flex flex-wrap gap-x-3 gap-y-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="clientType"
                value="Citizen"
                checked={form.clientType === "Citizen"}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 bg-gray-700 border-gray-500 rounded"
              />
              <span className="ml-2 text-white text-sm sm:text-base">
                Citizen
              </span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="clientType"
                value="Business"
                checked={form.clientType === "Business"}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 bg-gray-700 border-gray-500 rounded"
              />
              <span className="ml-2 text-white text-sm sm:text-base">
                Business
              </span>
            </label>
            <label className="inline-flex items-center w-full sm:w-auto">
              <input
                type="radio"
                name="clientType"
                value="Government"
                checked={form.clientType === "Government"}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 bg-gray-700 border-gray-500 rounded"
              />
              <span className="ml-2 text-white text-sm sm:text-base">
                Government (Employee or another agency)
              </span>
            </label>
          </div>
          {errors.clientType && (
            // REDUCED: Margin from mt-2 to mt-1.5
            <p className="text-xs sm:text-sm text-red-400 mt-1.5">
              {errors.clientType}
            </p>
          )}
        </div>

        {/* Date and Sex */}
        {/* REDUCED: Padding, Gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 bg-gray-600 p-2 sm:p-3 rounded-lg">
          <div>
            <label
              htmlFor="date"
              // REDUCED: Margin from mb-2 to mb-1.5
              className="block text-white text-sm sm:text-base md:text-lg font-bold mb-1.5"
            >
              Date:
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              max={today}
              // REDUCED: Vertical padding from py-2 to py-1.5 (mobile)
              className={`form-input mt-1 block w-full px-3 sm:px-4 py-1.5 sm:py-2 border rounded-md shadow-sm text-sm sm:text-base bg-gray-700 text-white ${
                errors.date ? "border-red-400" : "border-gray-500"
              }`}
            />
            {errors.date && (
              // REDUCED: Margin from mt-2 to mt-1.5
              <p className="text-xs sm:text-sm text-red-400 mt-1.5">
                {errors.date}
              </p>
            )}
          </div>
          <div>
            {/* REDUCED: Margin from mb-2 to mb-1.5 */}
            <label className="block text-white text-sm sm:text-base md:text-lg font-bold mb-1.5">
              Sex:
            </label>
            {/* REDUCED: Margin from mt-2 to mt-1.5 */}
            <div className="flex gap-4 mt-1.5">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="sex"
                  value="Male"
                  checked={form.sex === "Male"}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 sm:h-5 sm:w-5 bg-gray-700 border-gray-500"
                />
                <span className="ml-2 text-white text-sm sm:text-base">
                  Male
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="sex"
                  value="Female"
                  checked={form.sex === "Female"}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 sm:h-5 sm:w-5 bg-gray-700 border-gray-500"
                />
                <span className="ml-2 text-white text-sm sm:text-base">
                  Female
                </span>
              </label>
            </div>
            {errors.sex && (
              // REDUCED: Margin from mt-2 to mt-1.5
              <p className="text-xs sm:text-sm text-red-400 mt-1.5">
                {errors.sex}
              </p>
            )}
          </div>
        </div>

        {/* Age and Region */}
        {/* REDUCED: Padding, Gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 bg-gray-600 p-2 sm:p-3 rounded-lg">
          <div>
            <label
              htmlFor="age"
              // REDUCED: Margin from mb-2 to mb-1.5
              className="block text-white text-sm sm:text-base md:text-lg font-bold mb-1.5"
            >
              Age:
            </label>
            <select
              id="age"
              name="age"
              value={form.age}
              onChange={handleChange}
              // REDUCED: Vertical padding from py-2 to py-1.5 (mobile)
              className={`form-select mt-1 block w-full px-3 sm:px-4 py-1.5 sm:py-2 border rounded-md shadow-sm text-sm sm:text-base bg-gray-700 text-white ${
                errors.age ? "border-red-400" : "border-gray-500"
              }`}
            >
              <option value="">Select Age</option>
              <option value="18-24">18-24</option>
              <option value="25-34">25-34</option>
              <option value="35-44">35-44</option>
              <option value="45-54">45-54</option>
              <option value="55+">55+</option>
            </select>
            {errors.age && (
              // REDUCED: Margin from mt-2 to mt-1.5
              <p className="text-xs sm:text-sm text-red-400 mt-1.5">
                {errors.age}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="region"
              // REDUCED: Margin from mb-2 to mb-1.5
              className="block text-white text-sm sm:text-base md:text-lg font-bold mb-1.5"
            >
              Region of Residence:
            </label>
            <input
              type="text"
              id="region"
              name="region"
              value={form.region}
              onChange={handleChange}
              // REDUCED: Vertical padding from py-2 to py-1.5 (mobile)
              className={`form-input mt-1 block w-full px-3 sm:px-4 py-1.5 sm:py-2 border rounded-md shadow-sm text-sm sm:text-base bg-gray-700 text-white ${
                errors.region ? "border-red-400" : "border-gray-500"
              }`}
              placeholder="e.g., Metropolitan Manila"
            />
            {errors.region && (
              // REDUCED: Margin from mt-2 to mt-1.5
              <p className="text-xs sm:text-sm text-red-400 mt-1.5">
                {errors.region}
              </p>
            )}
          </div>
        </div>

        {/* Service Availed */}
        {/* REDUCED: Padding */}
        <div className="bg-gray-600 p-2 sm:p-3 rounded-lg">
          <label
            htmlFor="service"
            className="mb-1 block text-white text-sm sm:text-base md:text-lg font-bold"
          >
            Service Availed:
          </label>
          <textarea
            id="service"
            name="service"
            value={form.service}
            onChange={handleChange}
            // REDUCED: Vertical padding and height
            className={`form-textarea mt-1 block w-full px-3 sm:px-4 py-1.5 sm:py-2 border rounded-md shadow-sm text-sm sm:text-base bg-gray-700 text-white ${
              errors.service ? "border-red-400" : "border-gray-500"
            } h-14 sm:h-16 md:h-20`}
            placeholder="Describe the service you availed"
          />
          {errors.service && (
            // REDUCED: Margin from mt-2 to mt-1.5
            <p className="text-xs sm:text-sm text-red-400 mt-1.5">
              {errors.service}
            </p>
          )}
        </div>
      </div>

      {/* REDUCED: Margin-top and button padding */}
      <div className="mt-2 sm:mt-3 flex justify-end">
        <button
          type="button"
          onClick={handleLocalNext}
          className="px-6 sm:px-8 md:px-10 py-1.5 sm:py-2.5 bg-red-600 text-white font-extrabold text-sm sm:text-base md:text-lg rounded-full hover:bg-red-700 transition duration-150 shadow-lg uppercase tracking-wide cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// ... The SurveyForm component remains unchanged
const SurveyForm: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [surveyData, setSurveyData] = useState({
    demographics: {} as any,
    answers: {} as Record<string, string>
  });

  const handleNext = () => setCurrentQuestion((prev) => prev + 1);
  const handleBack = () => setCurrentQuestion((prev) => Math.max(0, prev - 1));

  const handleDemographicsComplete = (demographics: any) => {
    setSurveyData(prev => ({ ...prev, demographics }));
    handleNext();
  };

  const handleSubmitSurvey = async (finalAnswers?: Record<string, string>) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Combine all answers
      const allAnswers = { ...surveyData.answers, ...finalAnswers };
      
      // Prepare the response data
      const responseData = {
        surveyId: `citizen_satisfaction_${Date.now()}`,
        submittedAt: serverTimestamp(),
        demographics: {
          age: surveyData.demographics.age || 'Unknown',
          gender: surveyData.demographics.sex || 'Unknown',
          barangay: surveyData.demographics.region || 'Unknown',
          clientType: surveyData.demographics.clientType || 'Unknown',
          service: surveyData.demographics.service || 'Unknown'
        },
        answers: allAnswers,
        isComplete: true,
        metadata: {
          completedAt: new Date().toISOString(),
          duration: 'Unknown', // Could be calculated if needed
          device: 'web'
        }
      };

      console.log("Submitting survey data:", responseData);
      
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'responses'), responseData);
      console.log("Survey submitted successfully with ID:", docRef.id);
      
      setShowThankYou(true);
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("There was an error submitting your survey. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeThankYou = () => {
    setShowThankYou(false);
    setCurrentQuestion(0);
    setSurveyData({ demographics: {}, answers: {} });
  };

  const renderCurrentQuestion = () => {
    if (isSubmitting) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Submitting Survey...</h2>
            <p className="text-gray-600">Please wait while we save your responses.</p>
          </div>
        </div>
      );
    }
    
    if (showThankYou) return <ThankYouPage onClose={closeThankYou} />;

    switch (currentQuestion) {
      case 0:
        return <InitialSurveyDetails onNext={handleDemographicsComplete} />;
      case 1:
        return <SurveyQuestionCC1 onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <SurveyQuestionCC2 onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <SurveyQuestionCC3 onNext={handleNext} onBack={handleBack} />;
      case 4:
        return (
          <SurveyQuestionSQD1
            onFinish={(answers) => handleSubmitSurvey(answers)}
            onNext={() => handleSubmitSurvey()} // fallback
            onBack={handleBack}
            onCancel={handleBack}
          />
        );
      default:
        return <InitialSurveyDetails onNext={handleDemographicsComplete} />;
    }
  };

  return renderCurrentQuestion();
};

export default SurveyForm;
