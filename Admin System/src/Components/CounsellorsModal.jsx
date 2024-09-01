import { useNavigate } from "react-router-dom";
import "./Modal.css";
import axios from "axios";
import { useState } from "react";
function CounsellorsModal({ closeModal }) {
  const [first_name, setFirstName] = useState();
  const [last_name, setLastName] = useState();
  const [number, setNumber] = useState();
  const [email, setEmail] = useState();
  const [picture, setPicture] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("number", number);
    formData.append("email", email);
    formData.append("picture", picture);

    const url = "http://localhost:3000/panel/createCounsellor";

    axios
      .post(url, formData, {
        withCredentials: true,
      })
      .then((result) => {
        console.log(result);
        location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div
      className='modal-container'
      onClick={(e) => {
        if (e.target.className === "modal-container") {
          closeModal();
        }
      }}
    >
      <div className='modal'>
        <form className='modal-edit-form' onSubmit={handleSubmit}>
          <div className='modal-edit-form-inputs'>
            <div className='modal-add-input'>
              <label htmlFor='first_name'>First Name</label>
              <input
                type='text'
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className='modal-add-input'>
              <label htmlFor='last_name'>Last Name</label>
              <input
                type='text'
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className='modal-add-input'>
              <label htmlFor='number'>Phone Number</label>
              <input type='tel' onChange={(e) => setNumber(e.target.value)} />
            </div>
            <div className='modal-add-input'>
              <label htmlFor='email'>Email</label>
              <input type='email' onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='modal-add-input'>
              <label htmlFor='picture'>Picture</label>
              <input
                type='file'
                name='picture'
                // id="picture"
                onChange={(e) => setPicture(e.target.files[0])}
              />
            </div>
          </div>
          <button type='submit' className='modal-addBtn'>
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

export default CounsellorsModal;
