import { useState, useEffect, useContext, createContext } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { FirebaseContext } from "./FirebaseContext";
import { auth } from "../firebase/config";

const AuthContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  const signin = ({ email, password, callback }) => {
    return signInWithEmailAndPassword(auth, email, password).then((response) => {
      setUser(response.user);
      callback();
      return response.user;
    });
  };

  const signup = ({ email, password, callback }) => {
    return createUserWithEmailAndPassword(auth, email, password).then(
      (response) => {
        setUser(response.user);
        callback();
        return response.user;
      }
    );
  };

  const signout = () => {
    return signOut(auth).then(() => {
      setUser(null);
    });
  };

  const sendPasswordResetEmail = ({ email }) => {
    return sendPasswordResetEmail(auth, email).then(() => {
      return true;
    });
  };

  const confirmPasswordReset = ({ code, password }) => {
    return confirmPasswordReset(auth, code, password).then(() => {
      return true;
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading, // Return loading state
    signup,
    signin,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
  };
}
