import { useState } from 'react';
import { Card } from './Card';
import { 
  Plus, 
  Save, 
  Eye, 
  ArrowLeft, 
  GripVertical, 
  Trash2, 
  Copy,
  AlignLeft,
  CheckSquare,
  Star,
  Calendar,
  Mail,
  Phone,
  MapPin,
  User,
  Hash
} from 'lucide-react';

interface FormBuilderProps {
  onBack: () => void;
}

interface Question {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
}

export function FormBuilder({ onBack }: FormBuilderProps) {
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', type: 'text', label: 'What is your name?', required: true },
    { id: '2', type: 'multiple-choice', label: 'How satisfied are you with our service?', required: true, options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'] }
  ]);

  const questionTypes = [
    { type: 'text', label: 'Text Input', icon: AlignLeft },
    { type: 'multiple-choice', label: 'Multiple Choice', icon: CheckSquare },
    { type: 'rating', label: 'Rating Scale', icon: Star },
    { type: 'date', label: 'Date', icon: Calendar },
    { type: 'email', label: 'Email', icon: Mail },
    { type: 'phone', label: 'Phone', icon: Phone },
    { type: 'address', label: 'Address', icon: MapPin },
    { type: 'name', label: 'Full Name', icon: User },
    { type: 'number', label: 'Number', icon: Hash },
  ];

  const addQuestion = (type: string) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      label: `New ${type} question`,
      required: false,
      options: type === 'multiple-choice' ? ['Option 1', 'Option 2'] : undefined
    };
    setQuestions([...questions, newQuestion]);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const duplicateQuestion = (question: Question) => {
    const newQuestion = { ...question, id: Date.now().toString() };
    setQuestions([...questions, newQuestion]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-white">Survey Form Builder</h1>
            <p className="text-slate-400 mt-1">Drag and drop to create your survey</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Preview
          </button>
          <button className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
            <Save className="w-5 h-5" />
            Save Draft
          </button>
          <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg">
            Publish Survey
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Types Panel */}
        <Card className="lg:col-span-1">
          <h3 className="text-white mb-4">Question Types</h3>
          <div className="space-y-2">
            {questionTypes.map((qt) => {
              const Icon = qt.icon;
              return (
                <button
                  key={qt.type}
                  onClick={() => addQuestion(qt.type)}
                  className="w-full flex items-center gap-3 p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-left"
                >
                  <Icon className="w-5 h-5 text-slate-400" />
                  <span>{qt.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Form Canvas */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Survey Title"
                defaultValue="Community Service Satisfaction Survey"
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors mb-3"
              />
              <textarea
                placeholder="Survey Description"
                defaultValue="Help us improve our services by providing your valuable feedback."
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors resize-none"
                rows={3}
              />
            </div>

            <div className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="p-4 bg-slate-700 rounded-lg border border-slate-600 hover:border-red-500 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <button className="text-slate-400 hover:text-white cursor-move mt-2">
                      <GripVertical className="w-5 h-5" />
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <input
                          type="text"
                          value={question.label}
                          onChange={(e) => {
                            const updated = [...questions];
                            updated[index].label = e.target.value;
                            setQuestions(updated);
                          }}
                          className="flex-1 px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                        />
                        <div className="flex items-center gap-2 ml-3">
                          <label className="flex items-center gap-2 text-slate-300">
                            <input
                              type="checkbox"
                              checked={question.required}
                              onChange={(e) => {
                                const updated = [...questions];
                                updated[index].required = e.target.checked;
                                setQuestions(updated);
                              }}
                              className="rounded"
                            />
                            Required
                          </label>
                        </div>
                      </div>

                      {question.type === 'multiple-choice' && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <input
                                type="radio"
                                disabled
                                className="text-red-600"
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const updated = [...questions];
                                  if (updated[index].options) {
                                    updated[index].options![optIndex] = e.target.value;
                                    setQuestions(updated);
                                  }
                                }}
                                className="flex-1 px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                              />
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const updated = [...questions];
                              if (updated[index].options) {
                                updated[index].options!.push(`Option ${updated[index].options!.length + 1}`);
                                setQuestions(updated);
                              }
                            }}
                            className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Option
                          </button>
                        </div>
                      )}

                      {question.type === 'text' && (
                        <input
                          type="text"
                          placeholder="Answer will appear here..."
                          disabled
                          className="w-full px-3 py-2 bg-slate-800 text-slate-500 rounded-lg border border-slate-600"
                        />
                      )}

                      {question.type === 'rating' && (
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button key={num} disabled className="p-2 text-slate-500">
                              <Star className="w-6 h-6" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => duplicateQuestion(question)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteQuestion(question.id)}
                        className="p-2 text-red-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => addQuestion('text')}
                className="w-full p-4 border-2 border-dashed border-slate-600 hover:border-red-500 rounded-lg text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Question
              </button>
            </div>
          </Card>

          {/* Survey Settings */}
          <Card>
            <h3 className="text-white mb-4">Survey Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-2">Start Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-2">End Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-2">Target Barangay</label>
                <select className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors">
                  <option>All Barangays</option>
                  <option>Barangay 1</option>
                  <option>Barangay 2</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-2">Response Limit</label>
                <input
                  type="number"
                  placeholder="Unlimited"
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
