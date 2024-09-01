import { useEffect, useState } from "react";
import "./EditModal.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { TimePicker } from "antd";
import moment from "moment";

const { RangePicker } = TimePicker;

function EditModal() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [picture, setPicture] = useState(null);
  const [timeRange, setTimeRange] = useState([null, null]);
  const [speciality, setSpeciality] = useState("");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(showLoading());
    axios
      .get(`http://localhost:3000/panel/UserInfo/${user?.id}`)
      .then((result) => {
        const data = result.data;
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setNumber(data.number);
        setEmail(data.email);
        setPicture(data.picture);
        setSpeciality(data.specialization);
        const timings = data.timings
          ? data.timings.map((time) => moment(time, "HH:mm"))
          : [null, null];
        setTimeRange(timings);
        dispatch(hideLoading());
      })
      .catch((err) => {
        console.error(err);
        dispatch(hideLoading());
      });
  }, [user?.id, dispatch]);

  function handleUpdate(e) {
    e.preventDefault();
    dispatch(showLoading());
    axios
      .put(`http://localhost:3000/panel/updateUserInfo/${user.id}`, {
        first_name,
        last_name,
        number,
        email,
        speciality,
        timings: timeRange,
      })
      .then((res) => {
        if (res.data.status) {
          toast.success(res.data.message);
          navigate("/panel");
          dispatch(hideLoading());
        } else {
          toast.error(res.data.message);
          dispatch(hideLoading());
        }
      })
      .catch((err) => {
        console.error(err);
        dispatch(hideLoading());
      });
  }

  const handleTimeChange = (value) => {
    if (value && value.length === 2) {
      const formattedTimes = value.map((m) => m.format("HH:mm"));
      setTimeRange(formattedTimes);
    }
  };

  const handleChangeSpeciality = (e) => {
    const value = e.target.value.replace(/[^A-Za-z]/g, "");
    setSpeciality(value);
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

  return (
    <div className="edit-modal-container">
      <div className="edit-modal">
        <form className="edit-modal-edit-form" onSubmit={handleUpdate}>
          <div className="edit-modal-edit-form-inputs">
            <div className="edit-modal-add-input">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                value={first_name}
                onChange={handleChangeFirstName}
              />
            </div>
            <div className="edit-modal-add-input">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                value={last_name}
                onChange={handleChangeLastName}
              />
            </div>
            <div className="edit-modal-add-input">
              <label htmlFor="number">Phone Number</label>
              <input
                type="tel"
                value={number}
                onChange={handleChange}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="10"
              />
            </div>
            <div className="edit-modal-add-input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="edit-modal-add-input">
              <label htmlFor="speciality">Speciality</label>
              <input
                type="text"
                onChange={handleChangeSpeciality}
                maxLength={20}
                value={speciality}
              />
            </div>
            <div className="edit-modal-add-input">
              <label htmlFor="timing">Working hours</label>
              <RangePicker
                showTime={{ format: "HH:mm" }}
                onChange={handleTimeChange}
                className="timing"
                value={timeRange.map((time) =>
                  time ? moment(time, "HH:mm") : null
                )}
              />
            </div>
            <div className="edit-modal-add-input">
              <label htmlFor="picture">Picture</label>
              <input
                type="file"
                onChange={(e) => setPicture(e.target.files[0])}
              />
            </div>
          </div>
          <button type="submit" className="modal-addBtn">
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
