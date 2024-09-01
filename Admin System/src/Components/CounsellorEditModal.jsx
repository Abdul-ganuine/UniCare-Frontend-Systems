import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Modal.css";
import axios from "axios";
function CounsellorEditModal({ closeModal, editRowID }) {
  const [first_name, setFirstName] = useState();
  const [last_name, setLastName] = useState();
  const [number, setNumber] = useState();
  const [email, setEmail] = useState();
  const [picture, setPicture] = useState();
  const id = editRowID;
  console.log(id);
  useEffect(() => {
    axios
      .get("http://localhost:3000/panel/counsellorInfo/" + id)
      .then((result) => {
        setFirstName(result.data.first_name);
        setLastName(result.data.last_name);
        setNumber(result.data.number);
        setEmail(result.data.email);
        setPicture(result.data.picture);
      })
      .catch((err) => console.log(err));
  }, [id]);

  function handleUpdate(e) {
    e.preventDefault();
    axios
      .put("http://localhost:3000/panel/updateCounsellor/" + id, {
        first_name,
        last_name,
        number,
        email,
      })
      .then((result) => {
        closeModal();
        location.reload();
      })
      .catch((err) => console.log(err));
  }
  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === "modal-container") {
          closeModal();
        }
      }}
    >
      <div className="modal">
        <form className="modal-edit-form" onSubmit={handleUpdate}>
          <div className="modal-edit-form-inputs">
            <div className="modal-add-input">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="modal-add-input">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="modal-add-input">
              <label htmlFor="number">Phone Number</label>
              <input
                type="tel"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
            <div className="modal-add-input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="modal-add-input">
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

export default CounsellorEditModal;
