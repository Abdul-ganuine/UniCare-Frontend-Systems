import { useState } from "react";
import "../Pages/Signup.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post("http://localhost:3000/api/auth/forgot-password", {
        email,
      })
      .then((res) => {
        if (res.data.status) {
          alert("Check your email for reset link.");
          navigate("/login");
        }
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div className="signup-container">
      <h2>Forgot Password</h2>
      <form action="" className="sign-up-form" onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Reset</button>
        <p>
          Have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;
