// admin-dashboard/src/components/TestConnection.tsx
import React, { useState, useEffect } from 'react';
import { surveyService, Survey } from '../Services/FirebaseService';

const TestConnection: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const surveysData = await surveyService.getSurveys();
        setSurveys(surveysData || []);
      } catch (error) {
        console.error('Error fetching surveys:', error);
        setSurveys([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3>Connection Test - Surveys Count: {surveys.length}</h3>
      {surveys.map((survey: Survey) => (
        <div key={survey.id}>
          <p>{survey.title} - Status: {survey.status}</p>
        </div>
      ))}
    </div>
  );
};

export default TestConnection;