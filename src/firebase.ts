import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCplmJ0oXXh3S16pkc0SymZhthxP9os0no",
    authDomain: "whatnew-b7aff.firebaseapp.com",
    projectId: "whatnew-b7aff",
    storageBucket: "whatnew-b7aff.firebasestorage.app",
    messagingSenderId: "1004915649996",
    appId: "1:1004915649996:web:7ea4ae7ad8aa9a45dd8169",
    measurementId: "G-ME8FZSDRF2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export default app;
