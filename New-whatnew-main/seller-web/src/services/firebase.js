// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8bfVxlXGrkuu6beYa2IajZOgjTBlh3CI",
  authDomain: "whatnew-live.firebaseapp.com",
  projectId: "whatnew-live",
  storageBucket: "whatnew-live.firebasestorage.app",
  messagingSenderId: "176067241133",
  appId: "1:176067241133:web:8e1b94d96c65b6e0785224",
  measurementId: "G-5RJN0X956M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google Provider
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Google Sign-In function using redirect (to avoid COOP issues)
export const signInWithGoogle = async () => {
  try {
    // Try popup first, fallback to redirect if COOP blocks it
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return await processGoogleResult(result);
    } catch (popupError) {
      if (popupError.code === 'auth/popup-blocked' || 
          popupError.message.includes('Cross-Origin-Opener-Policy')) {
        // Fallback to redirect method
        throw new Error('POPUP_BLOCKED');
      }
      throw popupError;
    }
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    if (error.message === 'POPUP_BLOCKED') {
      throw new Error('Popup was blocked. Please allow popups or try again.');
    }
    throw error;
  }
};

// Helper function to process Google auth result
const processGoogleResult = async (result) => {
  const user = result.user;
  
  // Get the access token
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const accessToken = credential?.accessToken;
  
  if (!accessToken) {
    throw new Error('Failed to get Google access token');
  }
  
  return {
    user: {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    },
    accessToken
  };
};

export { auth, googleProvider };