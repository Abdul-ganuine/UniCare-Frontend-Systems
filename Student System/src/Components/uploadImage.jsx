import "./uploadImage.css";
import img from "../assets/defaultProf.jpg";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../Context/ContextApi";

import axios from "axios";
function UploadImage() {
  const { updateProfile, setUpdateProfile, currentUser } =
    useContext(GlobalContext);
  const [image, setImage] = useState(null);
  // useEffect(() => {
  //   console.log(instImage);
  // }, [instImage]);

  return (
    <div className='updateBox'>
      <div className='infoBox'>
        <div className='imgBox'>
          <img
            src={instImage ? `http://localhost:3000/ ${instImage}` : img}
            alt='image'
          />
        </div>

        {updateProfile ? (
          <div className='prof-info'>
            <form
              style={{
                marginLeft: "0",
                display: "flex",
                flexDirection: "column",
              }}
              // onSubmit={handleImagePost}
            >
              <h2 style={{ marginBottom: "-20px" }}>Upload a New Photo</h2>
              <input
                type='file'
                name=''
                id=''
                style={{ width: "200px" }}
                onChange={(e) => setImage(e.target.files[0])}
              />
              <button type='submit'>submit</button>
            </form>
          </div>
        ) : (
          <div className='prof-info'>
            <h2>Akosua Agyapong</h2>
            <p>akosuaOfficial</p>
          </div>
        )}
      </div>

      {!updateProfile && (
        <>
          <button
            className='update'
            onClick={() => setUpdateProfile(!updateProfile)}
          >
            Update
          </button>
        </>
      )}
    </div>
  );
}

export default UploadImage;
