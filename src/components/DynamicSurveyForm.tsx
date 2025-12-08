import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';

interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  status: string;
  isPrimary?: boolean;
  createdAt?: any; // Firebase Timestamp
}

interface Question {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
}

interface DynamicSurveyFormProps {
  onComplete: () => void;
}

export default function DynamicSurveyForm({ onComplete }: DynamicSurveyFormProps) {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [demographics, setDemographics] = useState({
    age: '',
    sex: '',
    barangay: '',
    clientType: '',
    service: '',
    date: new Date().toISOString().split('T')[0], // Today's date as default
    regionOfResidence: 'Metropolitan Manila' // Default value
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemographics, setShowDemographics] = useState(true);

  useEffect(() => {
    fetchActiveSurveys();
    
    // Set up a periodic refresh to check for new surveys
    const interval = setInterval(() => {
      console.log('🔄 Checking for new surveys...');
      fetchActiveSurveys();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchActiveSurveys = async () => {
    try {
      console.log('🔍 Fetching primary citizen survey...');
      
      // First try to get the primary survey for citizens
      const primaryQuery = query(
        collection(db, 'surveys'),
        where('status', '==', 'active'),
        where('isPrimary', '==', true)
      );
      
      const primarySnapshot = await getDocs(primaryQuery);
      
      if (primarySnapshot.size > 0) {
        const primarySurvey = {
          id: primarySnapshot.docs[0].id,
          ...primarySnapshot.docs[0].data()
        } as Survey;
        
        console.log('🎯 Found primary survey:', primarySurvey.title);
        setSurveys([primarySurvey]);
        setSelectedSurvey(primarySurvey);
        return;
      }
      
      // Fallback: if no primary survey, get the latest active survey
      console.log('📝 No primary survey found, getting latest active...');
      const surveysQuery = query(
        collection(db, 'surveys'),
        where('status', '==', 'active')
      );
      
      const snapshot = await getDocs(surveysQuery);
      console.log('📊 Found surveys:', snapshot.size);
      
      const surveysData = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('📝 Survey data:', { 
          id: doc.id, 
          title: data.title, 
          status: data.status, 
          isPrimary: data.isPrimary,
          questionsCount: data.questions?.length || 0
        });
        return {
          id: doc.id,
          ...data
        };
      }) as Survey[];
      
      console.log('✅ Active surveys found:', surveysData.length);
      setSurveys(surveysData);
      
      // Auto-select the first survey if available
      if (surveysData.length > 0) {
        setSelectedSurvey(surveysData[0]);
        console.log('🎯 Selected survey:', surveysData[0].title);
      } else {
        console.log('❌ No active surveys found');
      }
    } catch (error) {
      console.error('💥 Error fetching surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDemographicsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDemographics(false);
    setCurrentQuestionIndex(0);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (selectedSurvey && currentQuestionIndex < selectedSurvey.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      setShowDemographics(true);
    }
  };

  const handleSubmit = async () => {
    if (!selectedSurvey) return;
    
    setIsSubmitting(true);
    try {
      const responseData = {
        surveyId: selectedSurvey.id,
        submittedAt: serverTimestamp(),
        demographics: {
          age: demographics.age,
          sex: demographics.sex,
          barangay: demographics.barangay,
          clientType: demographics.clientType,
          service: demographics.service,
          date: demographics.date,
          regionOfResidence: demographics.regionOfResidence
        },
        answers: answers,
        isComplete: true,
        metadata: {
          completedAt: new Date().toISOString(),
          device: 'web'
        }
      };

      await addDoc(collection(db, 'responses'), responseData);
      onComplete();
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('There was an error submitting your survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Survey...</h2>
        </div>
      </div>
    );
  }

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

  if (surveys.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">No Active Surveys</h2>
          <p className="text-gray-600 mb-4">
            There are currently no active surveys available. Please check back later.
          </p>
          <button
            onClick={() => {
              setLoading(true);
              fetchActiveSurveys();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  if (showDemographics) {
    const valenzuelaBarangays = [
      'Arkong Bato', 'Bagbaguin', 'Balangkas', 'Bignay', 'Bisig', 'Canumay East', 'Canumay West',
      'Coloong', 'Dalandanan', 'Gen. T. de Leon', 'Hen. T. de Leon', 'Isla', 'Karuhatan',
      'Lawang Bato', 'Lingunan', 'Mabolo', 'Malanday', 'Malinta', 'Mapulang Lupa', 'Marulas',
      'Maysan', 'Palasan', 'Parada', 'Pariancillo Villa', 'Paso de Blas', 'Pasolo', 'Poblacion',
      'Pulo', 'Punturin', 'Rincon', 'Tagalag', 'Ugong', 'Viente Reales', 'Wawang Pulo'
    ];

    return (
      <div className="bg-slate-800 rounded-lg shadow-2xl max-w-4xl mx-auto p-6 sm:p-8 text-white">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {selectedSurvey ? selectedSurvey.title : 'Survey Information'}
          </h2>
          {selectedSurvey && selectedSurvey.description && (
            <p className="text-gray-300 mb-4">{selectedSurvey.description}</p>
          )}
          {(!selectedSurvey?.description || selectedSurvey.description.trim() === '') && (
            <p className="text-gray-300">Please provide some basic information to get started.</p>
          )}
        </div>

        <form onSubmit={handleDemographicsSubmit} className="space-y-6">
          {/* Client Type */}
          <div className="bg-slate-700 p-6 rounded-lg">
            <label className="block text-white font-medium mb-4 text-lg">Client Type:</label>
            <div className="flex flex-wrap gap-4">
              {[
                { value: 'citizen', label: 'Citizen' },
                { value: 'business', label: 'Business' },
                { value: 'government', label: 'Government (Employee or another agency)' }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="clientType"
                    value={option.value}
                    checked={demographics.clientType === option.value}
                    onChange={(e) => setDemographics(prev => ({ ...prev, clientType: e.target.value }))}
                    className="w-5 h-5 text-blue-500 bg-slate-600 border-slate-500 focus:ring-blue-500 focus:ring-2"
                    required
                  />
                  <span className="text-white">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div className="bg-slate-700 p-6 rounded-lg">
              <label className="block text-white font-medium mb-3">Date:</label>
              <input
                type="date"
                value={demographics.date}
                max={new Date().toISOString().split('T')[0]} // Prevent future dates
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  const today = new Date().toISOString().split('T')[0];
                  
                  if (selectedDate > today) {
                    alert('Please select a date that is today or in the past.');
                    return;
                  }
                  
                  setDemographics(prev => ({ ...prev, date: selectedDate }));
                }}
                required
                className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Sex */}
            <div className="bg-slate-700 p-6 rounded-lg">
              <label className="block text-white font-medium mb-4">Sex:</label>
              <div className="flex gap-6">
                {[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sex"
                      value={option.value}
                      checked={demographics.sex === option.value}
                      onChange={(e) => setDemographics(prev => ({ ...prev, sex: e.target.value }))}
                      className="w-4 h-4 text-blue-500 bg-slate-600 border-slate-500 focus:ring-blue-500 focus:ring-2"
                      required
                    />
                    <span className="text-white">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age */}
            <div className="bg-slate-700 p-6 rounded-lg">
              <label className="block text-white font-medium mb-3">Age:</label>
              <select
                value={demographics.age}
                onChange={(e) => setDemographics(prev => ({ ...prev, age: e.target.value }))}
                required
                className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Age Range</option>
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45-54">45-54</option>
                <option value="55-64">55-64</option>
                <option value="65+">65+</option>
              </select>
            </div>

            {/* Region of Residence */}
            <div className="bg-slate-700 p-6 rounded-lg">
              <label className="block text-white font-medium mb-3">Region of Residence:</label>
              <input
                type="text"
                value={demographics.regionOfResidence}
                onChange={(e) => setDemographics(prev => ({ ...prev, regionOfResidence: e.target.value }))}
                placeholder="e.g., Metropolitan Manila"
                required
                className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Service Availed */}
          <div className="bg-slate-700 p-6 rounded-lg">
            <label className="block text-white font-medium mb-3">Service Availed:</label>
            <textarea
              value={demographics.service}
              onChange={(e) => setDemographics(prev => ({ ...prev, service: e.target.value }))}
              placeholder="Describe the service you availed"
              required
              rows={4}
              className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors text-lg"
            >
              NEXT
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (!selectedSurvey || !selectedSurvey.questions) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Survey Error</h2>
          <p className="text-gray-600">Unable to load survey questions.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = selectedSurvey.questions[currentQuestionIndex];

  return (
    <div className="bg-slate-800 rounded-lg shadow-2xl max-w-4xl mx-auto p-6 sm:p-8 text-white">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-slate-600 rounded-full h-3 relative">
          <div 
            className="bg-red-600 h-3 rounded-full transition-all duration-300 relative"
            style={{ width: `${((currentQuestionIndex + 1) / selectedSurvey.questions.length) * 100}%` }}
          >
            <div className="absolute right-0 top-0 w-6 h-3 bg-red-600 rounded-full"></div>
          </div>
          {/* Progress dots */}
          <div className="absolute top-0 w-full flex justify-between px-1">
            {Array.from({ length: selectedSurvey.questions.length }).map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full -mt-0.5 border-2 ${
                  index <= currentQuestionIndex
                    ? 'bg-white border-red-600'
                    : 'bg-slate-600 border-slate-400'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions Banner */}
      <div className="bg-blue-600 p-4 rounded-lg mb-6">
        <p className="text-white text-sm leading-relaxed">
          <span className="font-bold">INSTRUCTIONS:</span> Please choose in the designated choices that corresponds to your answer on the Citizen's Charter (CC) questions. The Citizen's Charter is an official document that reflects the services of a government agency/office including its requirements, fees, and processing times among others.
        </p>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          {currentQuestion.label}
          {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
        </h2>

        {currentQuestion.type === 'text' && (
          <textarea
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            placeholder="Enter your answer"
            rows={4}
            className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        )}

        {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="flex items-start p-4 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option}
                  checked={answers[currentQuestion.id] === option}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  className="mt-1 mr-4 w-4 h-4 text-blue-500 bg-slate-600 border-slate-500 focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-white leading-relaxed">{index + 1}. {option}</span>
              </label>
            ))}
          </div>
        )}

        {currentQuestion.type === 'likert-scale' && currentQuestion.options && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentQuestion.id] === option;
                const emoji = option.split(' ').pop() || '';
                const text = option.replace(emoji, '').trim();
                
                return (
                  <label 
                    key={index} 
                    className={`relative flex flex-col items-center p-6 bg-slate-700 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-600/20 shadow-lg shadow-blue-500/25' 
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option}
                      checked={isSelected}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="sr-only"
                    />
                    <div className={`text-6xl mb-3 transition-transform duration-300 ${
                      isSelected ? 'animate-bounce scale-110' : 'hover:scale-110'
                    }`}>
                      {emoji || '❔'}
                    </div>
                    <span className={`text-center font-medium transition-colors ${
                      isSelected ? 'text-blue-300' : 'text-white'
                    }`}>
                      {text}
                    </span>
                    {isSelected && (
                      <div className="absolute inset-0 rounded-xl border-2 border-blue-400 animate-pulse"></div>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {currentQuestion.type === 'rating' && (
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleAnswerChange(currentQuestion.id, rating.toString())}
                className={`w-14 h-14 rounded-full border-2 font-semibold transition-colors ${
                  answers[currentQuestion.id] === rating.toString()
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-700 border-slate-500 text-white hover:border-blue-400'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors font-medium"
        >
          BACK
        </button>
        <button
          onClick={handleNext}
          disabled={currentQuestion.required && !answers[currentQuestion.id]}
          className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex === selectedSurvey.questions.length - 1 ? 'SUBMIT' : 'NEXT'}
        </button>
      </div>
    </div>
  );
}