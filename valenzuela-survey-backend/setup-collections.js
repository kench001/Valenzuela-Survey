// setup-collections.js
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';

// Your Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyD2E9bJJpIUh-MEQhfVqwF1iFmBT75lPUw",
  authDomain: "valenzuela-survey-system.firebaseapp.com",
  projectId: "valenzuela-survey-system",
  storageBucket: "valenzuela-survey-system.firebasestorage.app", 
  messagingSenderId: "621843421978",
  appId: "1:621843421978:web:7ea63ebb2ece9fa214aaa3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createCollections() {
  try {
    // 1. Create surveys collection
    await setDoc(doc(db, 'surveys', 'survey_001'), {
      title: "Valenzuela Development Survey 2025",
      description: "Community feedback survey",
      category: "community_development",
      status: "draft",
      createdBy: "admin_001",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: null,
      closesAt: null,
      settings: {
        allowAnonymous: true,
        maxResponses: null,
        requireLogin: false,
        allowMultipleResponses: false
      },
      questions: [
        {
          id: "q1",
          type: "multiple_choice",
          question: "What is your age group?",
          required: true,
          options: ["18-25", "26-35", "36-45", "46-55", "56+"],
          order: 1
        },
        {
          id: "q2",
          type: "text",
          question: "What improvements would you like to see in Valenzuela?",
          required: false,
          maxLength: 500,
          order: 2
        }
      ],
      demographics: {
        collectAge: true,
        collectGender: true,
        collectBarangay: true,
        collectEducation: false
      }
    });

    // 2. Create responses collection
    await setDoc(doc(db, 'responses', 'response_001'), {
      surveyId: "survey_001",
      respondentId: "citizen_001",
      submittedAt: serverTimestamp(),
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      demographics: {
        age: "25-34",
        gender: "female",
        barangay: "Barangay Polo",
        education: "college"
      },
      answers: {
        "q1": "26-35",
        "q2": "Better public transportation and more parks"
      },
      isComplete: true,
      metadata: {
        duration: 120,
        device: "mobile"
      }
    });

    // 3. Create citizens collection
    await setDoc(doc(db, 'citizens', 'citizen_001'), {
      email: "juan.cruz@example.com",
      firstName: "Juan",
      lastName: "Cruz",
      barangay: "Barangay Polo",
      phoneNumber: "+639123456789",
      createdAt: serverTimestamp(),
      lastActiveAt: serverTimestamp(),
      isVerified: true,
      demographics: {
        age: "25-34",
        gender: "male",
        education: "college",
        occupation: "teacher"
      }
    });

    // 4. Create admins collection
    await setDoc(doc(db, 'admins', 'admin_001'), {
      uid: "firebase_auth_uid_placeholder",
      email: "admin@valenzuela.gov.ph",
      firstName: "Maria",
      lastName: "Santos",
      role: "admin",
      permissions: {
        createSurveys: true,
        deleteSurveys: false,
        viewAnalytics: true,
        manageUsers: false
      },
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      isActive: true
    });

    // 5. Create categories collection
    await setDoc(doc(db, 'categories', 'community_development'), {
      name: "Community Development",
      description: "Surveys related to community improvement",
      color: "#4CAF50",
      icon: "community",
      isActive: true,
      createdAt: serverTimestamp()
    });

    await setDoc(doc(db, 'categories', 'public_services'), {
      name: "Public Services",
      description: "Surveys about government services",
      color: "#2196F3",
      icon: "services",
      isActive: true,
      createdAt: serverTimestamp()
    });

    // 6. Create settings collection
    await setDoc(doc(db, 'settings', 'system_settings'), {
      siteName: "Valenzuela Citizen Survey",
      logo: "",
      theme: {
        primaryColor: "#1976D2",
        secondaryColor: "#FFC107"
      },
      email: {
        senderName: "Valenzuela City Government",
        senderEmail: "surveys@valenzuela.gov.ph",
        templates: {
          welcome: "Welcome to Valenzuela Citizen Survey System!",
          reminder: "Don't forget to complete your survey."
        }
      },
      notifications: {
        emailEnabled: true,
        smsEnabled: false
      }
    });

    console.log('✅ All collections created successfully!');
    console.log('📊 Database structure is now ready for your survey system');
    
  } catch (error) {
    console.error('❌ Error creating collections:', error);
  }
}

// Run the function
createCollections();