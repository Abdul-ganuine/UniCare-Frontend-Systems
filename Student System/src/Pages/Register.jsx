import { useContext, useEffect, useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { FaHandsHelping, FaTimes, FaUserGraduate } from "react-icons/fa";
import { GlobalContext } from "../Context/ContextApi";
import techLogo from "../assets/TechLogo.png";
import uniCareLogo from "../assets/logo-ksw.jpg";
import { toast } from "react-toastify";

const Register = () => {
  const { details, setDetails, currentUser, setCurrentUser, setStatus } =
    useContext(GlobalContext);

  const navigate = useNavigate();
  const [selectStatus, setSelectStatus] = useState(false);
  const [register, setRegister] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const status = "student";

  const handleSwitch = () => {
    setRegister(!register);
  };

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const url = register
      ? "http://localhost:3000/knust.students/wellnesshub/auth/register"
      : "http://localhost:3000/knust.students/wellnesshub/auth/login";

    const { username, staff_id, student_id, password, email } = details;

    try {
      let response;
      if (status === "student") {
        response = await axios.post(
          url,
          {
            username,
            student_id,
            password,
            email,
            status,
          },
          { withCredentials: true }
        );
      } else {
        response = await axios.post(url, {
          username,
          staff_id,
          password,
          email,
        });
      }

      setCurrentUser(response.data);

      localStorage.setItem("currentUser", JSON.stringify(response.data));

      setIsLoading(false);
      setDetails({
        username: "",
        student_id: "",
        staff_id: "",
        password: "",
        email: "",
      });
      navigate("/home");
    } catch (error) {
      toast.error("Ooops!, there was an error!, try again later", {
        autoClose: 2000,
      });
      console.error("There was an error!", error);
      setIsLoading(false);
    }
  };

  return (
    <div className='register-page'>
      <div className='title'>
        {/* <p className='bolded-text'>knust</p> */}
        <div>
          <img src={uniCareLogo} alt='' width={50} />
          <img src={techLogo} alt='' width={30} />
        </div>

        <h5 className='title-name' style={{ fontSize: "1.4rem" }}>
          uni<span className='care'>Care</span> App
        </h5>
      </div>
      <div className='content-body'>
        <div className='img-content'>
          <p className='img-welcome-txt'>welcome to your portal</p>
          <p className='img-sign-txt'>Sign in to get started</p>
        </div>
        <div className='forms-content'>
          {!selectStatus ? (
            <div className='status'>
              <div className='status-student'>
                <div className='status-main'>
                  <FaUserGraduate size={100} color='green' />
                  <p className='status-txt'>student</p>
                </div>

                <div className='status-sub'>
                  <p className='status-sub-txt'>Proceed to your dashboard</p>
                  <button
                    className='status-btn'
                    onClick={() => {
                      setSelectStatus(true);
                    }}
                  >
                    Click here
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <FaTimes
                className='status-decider-times'
                onClick={() => {
                  setSelectStatus(false);
                }}
              />

              <form action='' onSubmit={handleSubmit}>
                {register && (
                  <div className='input-btn name-input'>
                    <label htmlFor='username'>Username </label>
                    <input
                      className='inputs inputs-1'
                      type='text'
                      id='username'
                      name='username'
                      required
                      value={details.username}
                      onChange={handleChange}
                      placeholder='your name here'
                    />
                  </div>
                )}

                {status === "student" && (
                  <div className='input-btn id-input'>
                    <label htmlFor='student_id'>Student id </label>
                    <input
                      className='inputs inputs-2'
                      type='text'
                      id='student_id'
                      name='student_id'
                      value={details.student_id}
                      onChange={handleChange}
                      placeholder='20132354'
                      required
                    />
                  </div>
                )}

                <div className='input-btn password-input'>
                  <label htmlFor='password'>password </label>
                  <input
                    className='inputs inputs-3'
                    type='text'
                    id='password'
                    name='password'
                    value={details.password}
                    onChange={handleChange}
                    placeholder='password123$4'
                    required
                  />
                </div>

                {register && (
                  <div className='input-btn email-input'>
                    <label htmlFor='email'>Email </label>
                    <input
                      className='inputs inputs-4'
                      type='email'
                      id='email'
                      name='email'
                      value={details.email}
                      onChange={handleChange}
                      placeholder='thetekstudent@gmail.com'
                      required
                    />
                  </div>
                )}

                {isLoading ? (
                  <ClipLoader color='green' className='clipLoader' />
                ) : (
                  <div>
                    <button className='btn-first' type='submit'>
                      {register ? "Sign Up" : "Login"}
                    </button>

                    <div className='btn-2'>
                      <button
                        type='button'
                        onClick={handleSwitch}
                        style={{
                          cursor: "pointer",
                          border: "none",
                          background: "transparent",
                        }}
                      >
                        {register ? (
                          <>
                            <p>
                              Already have an Account?
                              <span style={{ color: "blue" }}> Login</span>
                              <p> </p>
                            </p>
                          </>
                        ) : (
                          <p>
                            New to this site?{" "}
                            <span style={{ color: "blue" }}> Register</span>
                          </p>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </div>

      <div className='footer'>
        <p>Kwame Nkrumah University of science and technology &copy;2024</p>
      </div>
    </div>
  );
};
export default Register;
