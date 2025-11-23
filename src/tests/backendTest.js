// Backend Test Script for Valenzuela Survey System
// Run this to test Firebase backend functionality

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  setDoc,
  deleteDoc,
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD2E9bJJpIUh-MEQhfVqwF1iFmBT75lPUw",
  authDomain: "valenzuela-survey-system.firebaseapp.com",
  projectId: "valenzuela-survey-system",
  storageBucket: "valenzuela-survey-system.firebasestorage.app", 
  messagingSenderId: "621843421978",
  appId: "1:621843421978:web:7ea63ebb2ece9fa214aaa3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

class BackendTester {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : '📋';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async test(testName, testFunction) {
    try {
      this.log(`Testing: ${testName}`, 'info');
      await testFunction();
      this.log(`${testName} - PASSED`, 'success');
      this.testResults.passed++;
      this.testResults.tests.push({ name: testName, status: 'PASSED' });
    } catch (error) {
      this.log(`${testName} - FAILED: ${error.message}`, 'error');
      this.testResults.failed++;
      this.testResults.tests.push({ name: testName, status: 'FAILED', error: error.message });
    }
  }

  // Test 1: Survey Submission (Citizen Flow)
  async testSurveySubmission() {
    const responseData = {
      surveyId: "test_survey_" + Date.now(),
      submittedAt: serverTimestamp(),
      demographics: {
        age: "26-35",
        gender: "male",
        barangay: "Barangay Test"
      },
      answers: {
        q1: "Very Satisfied",
        q2: "Improve public transportation",
        q3: "5"
      },
      isComplete: true,
      ipAddress: "127.0.0.1",
      metadata: {
        duration: 180,
        device: "desktop"
      }
    };

    const docRef = await addDoc(collection(db, 'responses'), responseData);
    
    // Verify the document was created
    const savedDoc = await getDoc(docRef);
    if (!savedDoc.exists()) {
      throw new Error('Survey response was not saved');
    }

    this.log(`Survey response saved with ID: ${docRef.id}`);
    
    // Clean up test data
    await deleteDoc(docRef);
  }

  // Test 2: Admin Authentication
  async testAdminAuth() {
    // First, create a test admin user
    const testEmail = "testadmin@valenzuela.gov.ph";
    const testPassword = "TestAdmin123!";
    
    try {
      // Try to create user (might fail if already exists)
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      
      // Create admin document
      await setDoc(doc(db, 'admins', userCredential.user.uid), {
        email: testEmail,
        firstName: "Test",
        lastName: "Admin",
        role: "admin",
        isActive: true,
        permissions: {
          createSurveys: true,
          viewAnalytics: true,
          manageUsers: true
        },
        createdAt: serverTimestamp()
      });
      
      this.log(`Test admin user created: ${userCredential.user.uid}`);
    } catch (error) {
      if (error.code !== 'auth/email-already-in-use') {
        throw error;
      }
      this.log('Test admin user already exists, proceeding with login test');
    }

    // Test login
    const loginResult = await signInWithEmailAndPassword(auth, testEmail, testPassword);
    if (!loginResult.user) {
      throw new Error('Admin login failed');
    }

    // Verify admin document exists
    const adminDoc = await getDoc(doc(db, 'admins', loginResult.user.uid));
    if (!adminDoc.exists()) {
      throw new Error('Admin document not found');
    }

    this.log(`Admin authenticated successfully: ${loginResult.user.email}`);
    
    // Test logout
    await signOut(auth);
    this.log('Admin logout successful');
  }

  // Test 3: Survey Management (Admin Flow)
  async testSurveyManagement() {
    // Create a test survey
    const surveyData = {
      title: "Backend Test Survey",
      description: "Test survey for backend validation",
      category: "testing",
      status: "draft",
      createdBy: "test_admin",
      createdAt: serverTimestamp(),
      questions: [
        {
          id: "q1",
          type: "multiple_choice",
          question: "How satisfied are you with our services?",
          options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"],
          required: true
        }
      ],
      settings: {
        allowAnonymous: true,
        maxResponses: null
      }
    };

    const docRef = await addDoc(collection(db, 'surveys'), surveyData);
    this.log(`Test survey created with ID: ${docRef.id}`);

    // Test reading surveys
    const surveysQuery = query(collection(db, 'surveys'), where('status', '==', 'draft'));
    const surveysSnapshot = await getDocs(surveysQuery);
    
    if (surveysSnapshot.empty) {
      throw new Error('No surveys found');
    }

    this.log(`Found ${surveysSnapshot.size} draft surveys`);

    // Clean up
    await deleteDoc(docRef);
  }

  // Test 4: Analytics Data Retrieval
  async testAnalyticsData() {
    // Create sample response data for analytics
    const sampleResponses = [
      {
        surveyId: "analytics_test",
        demographics: { age: "18-25", gender: "male", barangay: "Brgy 1" },
        submittedAt: serverTimestamp()
      },
      {
        surveyId: "analytics_test",
        demographics: { age: "26-35", gender: "female", barangay: "Brgy 2" },
        submittedAt: serverTimestamp()
      }
    ];

    const docRefs = [];
    for (const response of sampleResponses) {
      const docRef = await addDoc(collection(db, 'responses'), response);
      docRefs.push(docRef);
    }

    // Test analytics queries
    const responsesQuery = query(
      collection(db, 'responses'), 
      where('surveyId', '==', 'analytics_test')
    );
    const responsesSnapshot = await getDocs(responsesQuery);

    if (responsesSnapshot.size !== 2) {
      throw new Error(`Expected 2 responses, found ${responsesSnapshot.size}`);
    }

    this.log(`Analytics data query successful: ${responsesSnapshot.size} responses`);

    // Clean up
    for (const docRef of docRefs) {
      await deleteDoc(docRef);
    }
  }

  // Test 5: User Management
  async testUserManagement() {
    // Create test citizen document
    const citizenData = {
      email: "testcitizen@example.com",
      firstName: "Test",
      lastName: "Citizen",
      barangay: "Test Barangay",
      createdAt: serverTimestamp(),
      isVerified: false
    };

    const docRef = await addDoc(collection(db, 'citizens'), citizenData);
    this.log(`Test citizen created with ID: ${docRef.id}`);

    // Test querying citizens
    const citizensSnapshot = await getDocs(collection(db, 'citizens'));
    if (citizensSnapshot.empty) {
      throw new Error('No citizens found');
    }

    this.log(`Found ${citizensSnapshot.size} citizens in database`);

    // Clean up
    await deleteDoc(docRef);
  }

  // Test 6: Firebase Security Rules
  async testSecurityRules() {
    // This would test if security rules are properly configured
    // For now, we'll just check if collections are accessible
    try {
      await getDocs(collection(db, 'surveys'));
      this.log('Surveys collection accessible');
    } catch (error) {
      throw new Error(`Surveys collection access failed: ${error.message}`);
    }

    try {
      await getDocs(collection(db, 'responses'));
      this.log('Responses collection accessible');
    } catch (error) {
      throw new Error(`Responses collection access failed: ${error.message}`);
    }
  }

  // Main test runner
  async runAllTests() {
    console.log('\n🚀 Starting Valenzuela Survey Backend Tests...\n');
    
    await this.test('Survey Submission', () => this.testSurveySubmission());
    await this.test('Admin Authentication', () => this.testAdminAuth());
    await this.test('Survey Management', () => this.testSurveyManagement());
    await this.test('Analytics Data Retrieval', () => this.testAnalyticsData());
    await this.test('User Management', () => this.testUserManagement());
    await this.test('Security Rules', () => this.testSecurityRules());

    // Print results
    console.log('\n📊 Test Results Summary:');
    console.log(`✅ Tests Passed: ${this.testResults.passed}`);
    console.log(`❌ Tests Failed: ${this.testResults.failed}`);
    console.log(`📈 Success Rate: ${Math.round((this.testResults.passed / (this.testResults.passed + this.testResults.failed)) * 100)}%`);
    
    if (this.testResults.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults.tests
        .filter(test => test.status === 'FAILED')
        .forEach(test => console.log(`  - ${test.name}: ${test.error}`));
    }

    console.log('\n🎉 Backend testing completed!');
  }
}

// Export for use in development
export default BackendTester;

// Auto-run if this file is executed directly
if (typeof window === 'undefined') {
  const tester = new BackendTester();
  tester.runAllTests().catch(console.error);
}