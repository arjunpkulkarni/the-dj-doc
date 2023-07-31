import React, { useState } from "react";
import "./signupform.css";
import { useAuth } from "../../context/AuthContext";

const SignUpForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const auth = useAuth();

    const handleSubmit = (event) => {
        event.preventDefault();

        auth.signup({email, password, callback: () => {}});
        setEmail("");
        setPassword("");
      };

    return (
    <div className = "container">
        <form onSubmit = {handleSubmit}>

            <label>Email</label>
            <input 
                type = "email" 
                value = {email} 
                onChange = {(event) => setEmail(event.target.value)}
            />

            <label>Password</label>
            <input 
                type = "password"
                value = {password}
                onChange = {(event) => setPassword(event.target.value)}
            />

            <button type = "submit">Sign Up</button>

        </form>
    </div>
    );
};

export default SignUpForm;