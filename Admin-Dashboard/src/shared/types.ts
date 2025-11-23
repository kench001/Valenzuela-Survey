// shared/types.ts (create this in both projects)
export interface Survey {
  id?: string;
  title: string;
  description: string;
  category: string;
  status: 'draft' | 'active' | 'closed' | 'archived';
  createdBy: string;
  createdAt: any;
  updatedAt: any;
  publishedAt?: any;
  closesAt?: any;
  settings: {
    allowAnonymous: boolean;
    maxResponses: number | null;
    requireLogin: boolean;
    allowMultipleResponses: boolean;
  };
  questions: Question[];
  demographics: {
    collectAge: boolean;
    collectGender: boolean;
    collectBarangay: boolean;
    collectEducation: boolean;
  };
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'text' | 'rating' | 'checkbox' | 'dropdown';
  question: string;
  required: boolean;
  options?: string[];
  maxLength?: number;
  order: number;
}

export interface SurveyResponse {
  id?: string;
  surveyId: string;
  respondentId?: string;
  submittedAt: any;
  demographics: Record<string, string>;
  answers: Record<string, any>;
  isComplete: boolean;
  metadata: {
    duration?: number;
    device?: string;
  };
}