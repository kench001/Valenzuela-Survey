import React, { useState } from "react";
import SurveyQuestionCC1 from "./SurveyQuestionCC1";
import SurveyQuestionCC2 from "./SurveyQuestionCC2";
import SurveyQuestionCC3 from "./SurveyQuestionCC3";
import SurveyQuestionSQD1 from "./SurveyQuestionSQD1";
import ThankYouPage from "./ThankYouPage";

const InitialSurveyDetails: React.FC<{ onNext: () => void }> = ({ onNext }) => {
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
    if (validate()) onNext();
    else {
      const firstKey = Object.keys(errors)[0];
      const el = firstKey
        ? document.querySelector(`[name="${firstKey}"]`)
        : null;
      (el as HTMLElement | null)?.focus();
    }
  };

  return (
    <div className="relative p-4 sm:p-6 md:p-8 lg:p-10 bg-gray-800 rounded-lg sm:rounded-xl shadow-2xl w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto my-auto flex flex-col justify-between h-auto max-h-[85vh] overflow-y-auto">
      <div className="space-y-3 sm:space-y-5 md:space-y-6 flex-grow">
        {/* Client Type */}
        <div className="bg-gray-600 my-2 p-3 sm:p-4 rounded-lg">
          <label className="block text-white text-sm sm:text-base md:text-lg font-bold mb-2">
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
            <p className="text-xs sm:text-sm text-red-400 mt-2">
              {errors.clientType}
            </p>
          )}
        </div>

        {/* Date and Sex */}
        <div className="grid my-2 grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 bg-gray-600 p-3 sm:p-4 rounded-lg">
          <div>
            <label
              htmlFor="date"
              className="block text-white text-sm sm:text-base md:text-lg font-bold mb-2"
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
              className={`form-input mt-1 block w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-md shadow-sm text-sm sm:text-base md:text-lg bg-gray-700 text-white ${
                errors.date ? "border-red-400" : "border-gray-500"
              }`}
            />
            {errors.date && (
              <p className="text-xs sm:text-sm text-red-400 mt-2">
                {errors.date}
              </p>
            )}
          </div>
          <div>
            <label className="block text-white text-sm sm:text-base md:text-lg font-bold mb-2">
              Sex:
            </label>
            <div className="flex gap-4 mt-2">
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
              <p className="text-xs sm:text-sm text-red-400 mt-2">
                {errors.sex}
              </p>
            )}
          </div>
        </div>

        {/* Age and Region */}
        <div className="grid grid-cols-1 my-2 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 bg-gray-600 sm:p-4 rounded-lg">
          <div>
            <label
              htmlFor="age"
              className="block text-white text-sm sm:text-base md:text-lg font-bold mb-2"
            >
              Age:
            </label>
            <select
              id="age"
              name="age"
              value={form.age}
              onChange={handleChange}
              className={`form-select mt-1 block w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-md shadow-sm text-sm sm:text-base md:text-lg bg-gray-700 text-white ${
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
              <p className="text-xs sm:text-sm text-red-400 mt-2">
                {errors.age}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="region"
              className="block text-white text-sm sm:text-base md:text-lg font-bold mb-2"
            >
              Region of Residence:
            </label>
            <input
              type="text"
              id="region"
              name="region"
              value={form.region}
              onChange={handleChange}
              className={`form-input mt-1 block w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-md shadow-sm text-sm sm:text-base md:text-lg bg-gray-700 text-white ${
                errors.region ? "border-red-400" : "border-gray-500"
              }`}
              placeholder="e.g., Metropolitan Manila"
            />
            {errors.region && (
              <p className="text-xs sm:text-sm text-red-400 mt-2">
                {errors.region}
              </p>
            )}
          </div>
        </div>

        {/* Service Availed */}
        <div className="bg-gray-600 p-2 sm:p-4 rounded-lg">
          <label
            htmlFor="service"
            className="mb-1 block text-white text-sm sm:text-base md:text-lg font-bold"
          >
            Service Availed:
          </label>
          <textarea
            id="service"
            name="service"
            rows={1}
            value={form.service}
            onChange={handleChange}
            className={`form-textarea mt-1 block w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-md shadow-sm text-sm sm:text-base md:text-lg bg-gray-700 text-white ${
              errors.service ? "border-red-400" : "border-gray-500"
            } h-16 sm:h-20 md:h-24`}
            placeholder="Describe the service you availed"
          />
          {errors.service && (
            <p className="text-xs sm:text-sm text-red-400 mt-2">
              {errors.service}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 sm:mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleLocalNext}
          className="px-6 sm:px-8 md:px-10 py-2 sm:py-3 bg-red-600 text-white font-extrabold text-sm sm:text-base md:text-lg rounded-full hover:bg-red-700 transition duration-150 shadow-lg uppercase tracking-wide cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const SurveyForm: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleNext = () => setCurrentQuestion((prev) => prev + 1);
  const handleBack = () => setCurrentQuestion((prev) => Math.max(0, prev - 1));

  const handleSubmitSurvey = (answers?: Record<string, string>) => {
    console.log("Survey final answers:", answers ?? {});
    setShowThankYou(true);
  };

  const closeThankYou = () => {
    setShowThankYou(false);
    setCurrentQuestion(0);
  };

  const renderCurrentQuestion = () => {
    if (showThankYou) return <ThankYouPage onClose={closeThankYou} />;

    switch (currentQuestion) {
      case 0:
        return <InitialSurveyDetails onNext={handleNext} />;
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
            onNext={() => handleSubmitSurvey()} // fallback if SQD1 calls onNext instead of onFinish
            onBack={handleBack}
            onCancel={handleBack}
          />
        );
      default:
        return <InitialSurveyDetails onNext={handleNext} />;
    }
  };

  return (
    <div className="w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-3 sm:px-4">
      {renderCurrentQuestion()}
    </div>
  );
};

export default SurveyForm;
