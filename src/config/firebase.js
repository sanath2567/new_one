// import { initializeApp } from "firebase/app"
// import { getAuth } from "firebase/auth"
// import { getFirestore } from "firebase/firestore"
// import { getAnalytics } from "firebase/analytics"

// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyA8RhAwqjyNbG74Hkfbk-4-GLJbiB0r9R4",
//     authDomain: "crime-rate-9a152.firebaseapp.com",
//     projectId: "crime-rate-9a152",
//     storageBucket: "crime-rate-9a152.firebasestorage.app",
//     messagingSenderId: "299520561906",
//     appId: "1:299520561906:web:47cec5f9b3a32b4284366b",
//     measurementId: "G-S1GM1HCYBP"
// }

// // Initialize Firebase
// const app = initializeApp(firebaseConfig)

// // Initialize Firebase services
// export const auth = getAuth(app)
// export const db = getFirestore(app)
// export const analytics = getAnalytics(app)

// export default app

import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// ✅ Correct Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8RhAwqjyNbG74Hkfbk-4-GLJbiB0r9R4",
  authDomain: "crime-rate-9a152.firebaseapp.com",
  projectId: "crime-rate-9a152",

  // ✅ FIXED storage bucket
  storageBucket: "crime-rate-9a152.appspot.com",

  messagingSenderId: "299520561906",
  appId: "1:299520561906:web:47cec5f9b3a32b4284366b",
}

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig)

// ✅ Initialize Firebase Services
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
