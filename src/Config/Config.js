import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyD5VknYHESku-ruA1EhbNItQrUPDgoFY70",
    authDomain: "shopping-cart-33452.firebaseapp.com",
    projectId: "shopping-cart-33452",
    storageBucket: "shopping-cart-33452.appspot.com",
    messagingSenderId: "355012743333",
    appId: "1:355012743333:web:13c05f7684ec0a10523d4c",
    measurementId: "G-SW3RZNR3T9"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const fs = firebase.firestore();
const storage = firebase.storage();

export { auth, fs, storage }
