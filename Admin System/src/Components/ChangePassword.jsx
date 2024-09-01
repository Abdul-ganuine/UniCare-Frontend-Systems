import { useState } from "react";
import "./ChangePassword.css";
import axios from "axios";
import { hideLoading, showLoading } from "../redux/alertSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confrimPassword, setConfrimPassword] = useState("");

  const { user } = useSelector((state) => state.user);
  const id = user.id;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setOldPassword(password);
  };

  const handleConfirmPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfrimPassword(e.target.value);
  };

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(showLoading());
    axios
      .post("http://localhost:3000/panel/changePassword", {
        oldPassword,
        newPassword,
        confrimPassword,
        id,
      })
      .then((res) => {
        console.log(res);
        dispatch(hideLoading());
        if (res.data.status) {
          toast.success(res.data.message);
          localStorage.clear();
          navigate("/login");
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        if (err.response) {
          console.error("Response Error:", err.response.data);
          console.error("Response Status:", err.response.status);
          console.error("Response Headers:", err.response.headers);
        } else if (err.request) {
          console.error("Request Error:", err.request);
        } else {
          console.error("Error Message:", err.message);
        }
      });
  }

  return (
    <main className="change-password">
      <div className="change-password-container">
        <h2>Change your password</h2>
        <form className="change-password-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="oldPassword">Old Password</label>
            <div className="password-input-container">
              <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={handlePasswordChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Enter New Password</label>
            <div className="password-input-container">
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={handleConfirmPasswordChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confrimPassword">Confrim New Password</label>
            <div className="password-input-container">
              <input
                type="password"
                id="confirmPassword"
                value={confrimPassword}
                onChange={handleConfirmNewPasswordChange}
              />
            </div>
          </div>
          <button type="submit" className="change-password-button">
            Change my password
          </button>
        </form>
      </div>
    </main>
  );
}

export default ChangePassword;
