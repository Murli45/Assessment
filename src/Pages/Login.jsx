import React, { useState } from "react";
import classes from './Login.module.css'
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const responseMessage = (response) => {
    console.log(response);
    navigate("/dashboard");
  };
  const errorMessage = (error) => {
    console.log(error);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Dummy authentication logic
    if (email === "test@example.com" && password === "password") {
      // Redirect to main dashboard page
      // navigate('/dashboard');
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.login}>
      <h2>News on the go... 📇</h2>
      <p>Let's login to begin!</p>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
      <div className={classes.divider}>OR</div>
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
    </div>
    </div>
  );
}
