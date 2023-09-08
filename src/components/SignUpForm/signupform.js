import React, { useState } from "react";
import "./signupform.css";
import { useAuth } from "../../context/AuthContext";

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);

  const auth = useAuth();

  const toggleMode = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    auth.signup({ email, password, callback: () => {} });
    setEmail("");
    setPassword("");
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit">{isLoginMode ? "Login" : "Sign Up"}</button>
      </form>
      <div className="toggle_button">
        <button onClick={toggleMode}>
          {isLoginMode ? "Switch to Sign Up" : "Switch to Login"}
        </button>
      </div>
    </div>
  );
};

export default SignUpForm;
