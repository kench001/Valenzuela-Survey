import { useState } from 'react';
import { Card } from './Card';
import { ChevronDown, ChevronRight, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement
);

interface Question {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
}

interface Response {
  id: string;
  answers: Record<string, string>;
  demographics?: {
    age?: string;
    sex?: string;
    barangay?: string;
    clientType?: string;
  };
  submittedAt: any;
}

interface QuestionAnalyticsProps {
  questions: Question[];
  responses: Response[];
}

export function QuestionAnalytics({ questions, responses }: QuestionAnalyticsProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const analyzeQuestion = (question: Question) => {
    const questionResponses = responses
      .map(r => r.answers[question.id])
      .filter(Boolean);

    if (questionResponses.length === 0) {
      return {
        totalResponses: 0,
        responseRate: 0,
        analysis: null
      };
    }

    const totalResponses = questionResponses.length;
    const responseRate = (totalResponses / responses.length) * 100;

    let analysis: any = {
      totalResponses,
      responseRate: Math.round(responseRate)
    };

    switch (question.type) {
      case 'multiple-choice':
        analysis = {
          ...analysis,
          ...analyzeMultipleChoice(question, questionResponses)
        };
        break;
      case 'likert-scale':
        analysis = {
          ...analysis,
          ...analyzeLikertScale(question, questionResponses)
        };
        break;
      case 'text':
        analysis = {
          ...analysis,
          ...analyzeTextResponses(questionResponses)
        };
        break;
      case 'rating':
        analysis = {
          ...analysis,
          ...analyzeRating(questionResponses)
        };
        break;
      default:
        analysis = {
          ...analysis,
          type: 'basic',
          summary: `${totalResponses} responses collected`
        };
    }

    return analysis;
  };

  const analyzeMultipleChoice = (question: Question, responses: string[]) => {
    const options = question.options || [];
    const counts = options.reduce((acc, option) => {
      acc[option] = responses.filter(r => r === option).length;
      return acc;
    }, {} as Record<string, number>);

    const sortedOptions = Object.entries(counts)
      .sort(([,a], [,b]) => b - a);

    return {
      type: 'multiple-choice',
      distribution: counts,
      topChoice: sortedOptions[0]?.[0] || 'No responses',
      topChoiceCount: sortedOptions[0]?.[1] || 0,
      chartData: {
        labels: options,
        datasets: [{
          data: options.map(opt => counts[opt]),
          backgroundColor: [
            '#dc2626', '#f59e0b', '#3b82f6', '#059669', '#7c3aed',
            '#ec4899', '#6b7280', '#f97316', '#06b6d4'
          ],
          borderWidth: 0
        }]
      }
    };
  };

  const analyzeLikertScale = (question: Question, responses: string[]) => {
    const options = question.options || [];
    const counts = options.reduce((acc, option) => {
      acc[option] = responses.filter(r => r === option).length;
      return acc;
    }, {} as Record<string, number>);

    // Calculate sentiment score
    const sentimentMap: Record<string, number> = {
      'Strongly Disagree 😞': 1,
      'Disagree 😕': 2,
      'Neither Agree nor Disagree 😐': 3,
      'Agree 😊': 4,
      'Strongly Agree 😍': 5,
      'N/A': 0
    };

    const scores = responses
      .map(r => sentimentMap[r] || 0)
      .filter(score => score > 0);

    const averageScore = scores.length > 0 
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
      : 0;

    const sentiment = averageScore >= 4 ? 'Positive' :
                     averageScore >= 3 ? 'Neutral' : 'Negative';

    const sentimentColor = sentiment === 'Positive' ? '#059669' :
                          sentiment === 'Neutral' ? '#f59e0b' : '#dc2626';

    return {
      type: 'likert-scale',
      distribution: counts,
      averageScore: Math.round(averageScore * 10) / 10,
      sentiment,
      sentimentColor,
      chartData: {
        labels: options,
        datasets: [{
          label: 'Responses',
          data: options.map(opt => counts[opt]),
          backgroundColor: options.map(opt => {
            const emoji = opt.split(' ').pop();
            switch(emoji) {
              case '😞': return '#dc2626';
              case '😕': return '#f97316';
              case '😐': return '#6b7280';
              case '😊': return '#3b82f6';
              case '😍': return '#059669';
              default: return '#9ca3af';
            }
          }),
          borderRadius: 4
        }]
      }
    };
  };

  const analyzeTextResponses = (responses: string[]) => {
    const avgLength = responses.reduce((sum, r) => sum + r.length, 0) / responses.length;
    const shortestResponse = Math.min(...responses.map(r => r.length));
    const longestResponse = Math.max(...responses.map(r => r.length));
    
    // Simple keyword analysis
    const allWords = responses.join(' ').toLowerCase().split(/\s+/);
    const wordCounts = allWords.reduce((acc, word) => {
      const cleaned = word.replace(/[^\w]/g, '');
      if (cleaned.length > 3) {
        acc[cleaned] = (acc[cleaned] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topWords = Object.entries(wordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return {
      type: 'text',
      avgLength: Math.round(avgLength),
      shortestResponse,
      longestResponse,
      topWords,
      summary: `Average response length: ${Math.round(avgLength)} characters`
    };
  };

  const analyzeRating = (responses: string[]) => {
    const ratings = responses.map(r => parseInt(r)).filter(r => !isNaN(r));
    const avgRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    
    const distribution = [1, 2, 3, 4, 5].reduce((acc, rating) => {
      acc[rating] = ratings.filter(r => r === rating).length;
      return acc;
    }, {} as Record<number, number>);

    return {
      type: 'rating',
      avgRating: Math.round(avgRating * 10) / 10,
      distribution,
      chartData: {
        labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
        datasets: [{
          label: 'Rating Distribution',
          data: [1, 2, 3, 4, 5].map(rating => distribution[rating]),
          backgroundColor: [
            '#dc2626', '#f97316', '#f59e0b', '#3b82f6', '#059669'
          ],
          borderRadius: 4
        }]
      }
    };
  };

  if (!questions.length) {
    return (
      <Card>
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-white text-lg font-medium">No Questions to Analyze</h3>
          <p className="text-slate-400 mt-2">Questions will appear here once surveys are created.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-semibold text-white">Question-Level Analytics</h2>
        <span className="text-sm text-slate-400">({questions.length} questions analyzed)</span>
      </div>

      {questions.map((question, index) => {
        const analysis = analyzeQuestion(question);
        const isExpanded = expandedQuestion === question.id;

        return (
          <Card key={question.id}>
            <div 
              className="cursor-pointer"
              onClick={() => setExpandedQuestion(isExpanded ? null : question.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="text-sm text-slate-400">Question {index + 1}</span>
                    <span className="text-xs bg-slate-700 px-2 py-1 rounded text-white">
                      {question.type}
                    </span>
                  </div>
                  <h3 className="text-white font-medium mb-2">{question.label}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-white">{analysis.totalResponses}</span>
                      <span className="text-slate-400">responses</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <PieChart className="w-4 h-4 text-blue-500" />
                      <span className="text-white">{analysis.responseRate}%</span>
                      <span className="text-slate-400">response rate</span>
                    </div>
                    {analysis.type === 'likert-scale' && (
                      <div className="flex items-center gap-1">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: analysis.sentimentColor }}
                        />
                        <span className="text-white">{analysis.sentiment}</span>
                        <span className="text-slate-400">sentiment</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {isExpanded && analysis.totalResponses > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                {/* Multiple Choice Analysis */}
                {analysis.type === 'multiple-choice' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-white font-medium mb-3">Response Distribution</h4>
                        <div className="h-64">
                          <Pie 
                            data={analysis.chartData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  labels: { color: 'white' }
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-3">Top Choice</h4>
                        <div className="bg-slate-700 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-green-400 mb-1">
                            {analysis.topChoice}
                          </div>
                          <div className="text-slate-300">
                            {analysis.topChoiceCount} responses ({Math.round((analysis.topChoiceCount / analysis.totalResponses) * 100)}%)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Likert Scale Analysis */}
                {analysis.type === 'likert-scale' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-white font-medium mb-3">Sentiment Distribution</h4>
                        <div className="h-64">
                          <Bar 
                            data={analysis.chartData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                x: { 
                                  ticks: { color: 'white' },
                                  grid: { color: '#374151' }
                                },
                                y: { 
                                  ticks: { color: 'white' },
                                  grid: { color: '#374151' }
                                }
                              },
                              plugins: {
                                legend: { display: false }
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-3">Sentiment Analysis</h4>
                        <div className="space-y-3">
                          <div className="bg-slate-700 p-4 rounded-lg">
                            <div className="text-sm text-slate-400 mb-1">Average Score</div>
                            <div className="text-2xl font-bold text-white">
                              {analysis.averageScore}/5.0
                            </div>
                          </div>
                          <div className="bg-slate-700 p-4 rounded-lg">
                            <div className="text-sm text-slate-400 mb-1">Overall Sentiment</div>
                            <div 
                              className="text-lg font-semibold"
                              style={{ color: analysis.sentimentColor }}
                            >
                              {analysis.sentiment}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Text Analysis */}
                {analysis.type === 'text' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-white font-medium mb-3">Response Statistics</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Average length:</span>
                            <span className="text-white">{analysis.avgLength} chars</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Shortest:</span>
                            <span className="text-white">{analysis.shortestResponse} chars</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Longest:</span>
                            <span className="text-white">{analysis.longestResponse} chars</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-3">Common Keywords</h4>
                        <div className="space-y-2">
                          {analysis.topWords.map(([word, count]: [string, number]) => (
                            <div key={word} className="flex justify-between">
                              <span className="text-slate-300">{word}</span>
                              <span className="text-blue-400">{count}x</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rating Analysis */}
                {analysis.type === 'rating' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-white font-medium mb-3">Rating Distribution</h4>
                        <div className="h-64">
                          <Bar 
                            data={analysis.chartData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                x: { 
                                  ticks: { color: 'white' },
                                  grid: { color: '#374151' }
                                },
                                y: { 
                                  ticks: { color: 'white' },
                                  grid: { color: '#374151' }
                                }
                              },
                              plugins: {
                                legend: { display: false }
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-3">Average Rating</h4>
                        <div className="bg-slate-700 p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-yellow-400 mb-2">
                            {analysis.avgRating}
                          </div>
                          <div className="text-slate-300">out of 5 stars</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}