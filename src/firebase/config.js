import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAeb2coeUUBzjF28Q7Xp2qWHu93YBlpJtI",
    authDomain: "dj-doc.firebaseapp.com",
    projectId: "dj-doc",
    storageBucket: "dj-doc.appspot.com",
    messagingSenderId: "116336889895",
    appId: "1:116336889895:web:0bca0f2ee5a702d71a7e02",
    measurementId: "G-BMCL0Z7EW4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

