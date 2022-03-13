// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signInWithPopup, signInAnonymously, GoogleAuthProvider } from "firebase/auth";
import "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyBwgVr9-rexiRmr5jbi8AUKh75UpHLYbyY",
  authDomain: "profiles-4d501.firebaseapp.com",
  databaseURL: "https://profiles-4d501-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "profiles-4d501",
  storageBucket: "profiles-4d501.appspot.com",
  messagingSenderId: "579427074486",
  appId: "1:579427074486:web:852e07b8d6d8d29adfc117",
  measurementId: "G-F8PK7FBNQT"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
            
export const provider = new GoogleAuthProvider()



export const signInAnonymous = () => {
    signInAnonymously(auth, provider)
    .then((res) => {
        const user = res.user
        console.log(user.uid, user.data)
    })
    .catch((error) => {
        console.log(error.message)
    })
}