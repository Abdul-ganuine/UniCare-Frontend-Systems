import { useState } from "react";
import "./Signup.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertSlice";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const dispatch = useDispatch();

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(showLoading());
    axios
      .post("http://localhost:3000/api/auth/login", {
        email,
        password,
      })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.status) {
          toast.success(res.data.message);
          localStorage.setItem("userId", res.data.userId);
          navigate("/panel");
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => dispatch(hideLoading()));
  }
  return (
    <div className='signup-container'>
      <h2>Login</h2>
      <form action='' className='sign-up-form' onSubmit={handleSubmit}>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          name=''
          autoComplete='off'
          placeholder='Email'
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor='password'>Password</label>
        <input
          type='password'
          name=''
          placeholder='********'
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type='submit'>Login</button>
        <Link to='/forgot-password'>Forgot Password</Link>
        {/* <p>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p> */}
      </form>
    </div>
  );
}

export default Login;
