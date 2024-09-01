import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { TimePicker } from "antd";
import "./Modal.css";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertSlice";
const { RangePicker } = TimePicker;
function Modal() {
  const [first_name, setFirstName] = useState();
  const [last_name, setLastName] = useState();
  const [number, setNumber] = useState();
  const [email, setEmail] = useState();
  const [picture, setPicture] = useState(null);
  const [role, setRole] = useState("admin");
  const [password, setPassword] = useState();
  const [speciality, setSpeciality] = useState();
  const [timeRange, setTimeRange] = useState(["", ""]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function handleSubmit(e) {
    e.preventDefault();
    dispatch(showLoading());
    const formData = new FormData();
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("number", number);
    formData.append("email", email);
    formData.append("picture", picture);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("speciality", speciality);
    formData.append("timings", timeRange);

    const url = "http://localhost:3000/api/auth/registerUser";
    axios
      .post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.status) {
          dispatch(hideLoading());
          toast.success(res.data.message);
          if (res.data.userRole === "doctor") {
            navigate("/panel/doctor");
          }
          if (res.data.userRole === "counsellor") {
            navigate("/panel/counsellor");
          }
          // navigate("/panel");
        } else {
          dispatch(hideLoading());
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handleTimeChange = (value) => {
    if (value && value.length === 2) {
      const startTime = value[0].format("HH:mm");
      const endTime = value[1].format("HH:mm");
      setTimeRange([startTime, endTime]);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    e.target.value = value;
    setNumber(e.target.value);
  };

  const handleChangeFirstName = (e) => {
    const value = e.target.value.replace(/[^A-Za-z]/g, "");
    e.target.value = value;
    setFirstName(e.target.value);
  };

  const handleChangeLastName = (e) => {
    const value = e.target.value.replace(/[^A-Za-z]/g, "");
    e.target.value = value;
    setLastName(e.target.value);
  };

  const handleChangeSpeciality = (e) => {
    const value = e.target.value.replace(/[^A-Za-z]/g, "");
    e.target.value = value;
    setSpeciality(e.target.value);
  };
  return (
    <div className="modal-container">
      <form className="modal-edit-form" onSubmit={handleSubmit}>
        <div className="modal-edit-form-inputs">
          <div className="modal-add-input">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              onChange={handleChangeFirstName}
              title="Only alphabets are allowed"
              maxLength={20}
            />
          </div>
          <div className="modal-add-input">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              onChange={handleChangeLastName}
              title="Only alphabets are allowed"
              maxLength={20}
            />
          </div>
          <div className="modal-add-input">
            <label htmlFor="number">Phone Number</label>
            <input
              type="tel"
              onChange={handleChange}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="10"
              title="Only numbers are allowed"
            />
          </div>
          <div className="modal-add-input">
            <label htmlFor="email">Email</label>
            <input type="email" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="modal-add-input">
            <label htmlFor="role">Role</label>
            <select onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="counsellor">Counsellor</option>
            </select>
          </div>
          <div className="modal-add-input">
            <label htmlFor="speciality">Speciality</label>
            <input
              type="text"
              onChange={handleChangeSpeciality}
              maxLength={20}
            />
          </div>
          <div className="modal-add-input">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="**********"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="modal-add-input">
            <label htmlFor="timing">Working hours</label>
            <RangePicker
              showTime={{ format: "HH:mm" }}
              onChange={handleTimeChange}
              className="timing"
            />
          </div>
          <div className="modal-add-input">
            <label htmlFor="picture">Picture</label>
            <input
              type="file"
              name="picture"
              // id="picture"
              onChange={(e) => setPicture(e.target.files[0])}
            />
          </div>
        </div>
        <button type="submit" className="modal-addBtn">
          Create
        </button>
      </form>
    </div>
  );
}

export default Modal;
