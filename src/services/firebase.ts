import { initializeApp } from 'firebase/app'
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
} from 'firebase/auth'
import {
    getFirestore,
    doc,
    setDoc,
    updateDoc,
    getDoc,
    addDoc,
    collection,
} from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyBOmm_89pREU3CGtr204IKZpgg1JFZXk6s',
    authDomain: 'websocket-lobby-42264.firebaseapp.com',
    databaseURL: 'https://websocket-lobby-42264-default-rtdb.firebaseio.com',
    projectId: 'websocket-lobby-42264',
    storageBucket: 'websocket-lobby-42264.appspot.com',
    messagingSenderId: '8578146585',
    appId: '1:8578146585:web:36f5ec5c2349ba743e2588',
    measurementId: 'G-SWM519SBJ4',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)

export {
    auth,
    db,
    signInWithPopup,
    GoogleAuthProvider,
    firebaseSignOut as signOut,
    doc,
    setDoc,
    updateDoc,
    getDoc,
    addDoc,
    collection,
}
