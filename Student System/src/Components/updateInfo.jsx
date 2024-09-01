import { useContext, useEffect, useState } from "react";
import "./updateInfo.css";
import { GlobalContext } from "../Context/ContextApi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import prof from "../assets/defaultProf.jpg";
function Updateinfo() {
  const {
    updateProfile,
    setUpdateProfile,
    profImage,
    setProfImage,
    currentUser,
  } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [details, setDetails] = useState({});
  const [image, setImage] = useState(null);

  const [updateDetails, setUpdateDetails] = useState({
    username: " ",
    schoolVoda: "",
    email: "",
    contact: "",
    country: "",
    region: "",
    postalAddress: "",
    residentialAddress: "",
  });

  // collecting and updating the user details in the database
  const handleChange = (e) => {
    setUpdateDetails({ ...updateDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //profile image update here
    let imgUrl;

    if (image) {
      const formData = new FormData();
      formData.append("profImage", image);
      const url = "http://localhost:3000/upload";

      try {
        const result = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
        imgUrl = result.data.img;
      } catch (error) {
        console.log(error);
      }
    }

    const {
      username,
      schoolVoda,
      email,
      contact,
      country,
      region,
      postalAddress,
      residentialAddress,
    } = updateDetails;

    try {
      const result = await axios.post(
        "http://localhost:3000/knust.students/wellnesshub/tasks/userdetails",
        {
          username,
          schoolVoda,
          email,
          contact,
          country,
          region,
          postalAddress,
          residentialAddress,
          img: imgUrl,
          userId: currentUser._id,
        },
        { withCredentials: true }
      );

      setDetails(result.data);
      setProfImage(result.data.img);

      setUpdateProfile(!updateProfile);
    } catch (error) {
      console.log(error);
    }
  };

  // end of user details update

  // instant fetching upon every mount
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await axios.get(
          "http://localhost:3000/knust.students/wellnesshub/tasks/userdetails",
          { withCredentials: true }
        );

        setDetails(result.data);
        setProfImage(result.data.img);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDetails();
  }, []);

  return (
    <>
      <div className='updateBox'>
        <div className='infoBox'>
          <div className='imgBox'>
            <img
              src={
                details.img
                  ? `http://localhost:3000/profImages/${profImage}`
                  : prof
              }
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
              </form>
            </div>
          ) : (
            <div className='prof-info'>
              <h2>{`${details.fetchDetails?.other_names ?? ""} ${
                details.fetchDetails?.surname ?? ""
              }`}</h2>
              <p>{details.username}</p>
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

      <div className='inputBox'>
        {updateProfile ? (
          <>
            <h3>Personal Details</h3>
            <form action='' onSubmit={handleSubmit}>
              <div className='inputSection'>
                <label htmlFor='username'>Username</label>
                <input
                  type='text'
                  id='username'
                  name='username'
                  value={updateDetails.username}
                  onChange={handleChange}
                />
              </div>

              <div className='inputSection'>
                <label htmlFor='schoolVoda'>KNUST Mobile Number</label>
                <input
                  type='text'
                  id='schoolVoda'
                  name='schoolVoda'
                  value={updateDetails.schoolVoda}
                  onChange={handleChange}
                />
              </div>
              <div className='inputSection'>
                <label htmlFor='email'>Other Email Address</label>
                <input
                  type='text'
                  id='email'
                  name='email'
                  value={updateDetails.email}
                  onChange={handleChange}
                />
              </div>
              <div className='inputSection'>
                <label htmlFor='contact'>Primary Phone Number</label>
                <input
                  type='text'
                  id='contact'
                  name='contact'
                  value={updateDetails.contact}
                  onChange={handleChange}
                />
              </div>
              <div className='inputSection'>
                <label htmlFor='country'>Country</label>
                <input
                  type='text'
                  id='country'
                  name='country'
                  value={updateDetails.country}
                  onChange={handleChange}
                />
              </div>

              <div className='inputSection'>
                <label htmlFor='postal'>Postal Address</label>
                <input
                  type='text'
                  id='postal'
                  name='postalAddress'
                  value={updateDetails.postalAddress}
                  onChange={handleChange}
                />
              </div>

              <div className='inputSection'>
                <label htmlFor='residential'>Residential Address</label>
                <input
                  type='text'
                  id='residential'
                  name='residentialAddress'
                  value={updateDetails.residentialAddress}
                  onChange={handleChange}
                />
              </div>

              <div className='inputSection'>
                <label htmlFor='region'>Region</label>
                <input
                  type='text'
                  id='region'
                  name='region'
                  value={updateDetails.region}
                  onChange={handleChange}
                />
              </div>

              <div className='buttonBox'>
                <button
                  className='backBtn'
                  onClick={() => {
                    setUpdateProfile(!updateProfile);
                  }}
                >
                  &larr; Back To Main Menu
                </button>
                <button type='submit' className='updateBtn'>
                  Update
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h3>Personal Details</h3>
            <form action=''>
              <div className='inputSection'>
                <label htmlFor=''>Full Name</label>
                <input
                  type='text'
                  value={` ${details.fetchDetails?.surname ?? ""} ${
                    details.fetchDetails?.other_names ?? ""
                  }`}
                  disabled
                />
              </div>
              <div className='inputSection'>
                <label htmlFor=''>Username</label>
                <input type='text' value={details.username} disabled />
              </div>
              <div className='inputSection'>
                <label htmlFor=''>Birth Date</label>
                <input
                  type='text'
                  value={details.fetchDetails?.date_of_birth ?? ""}
                  disabled
                />
              </div>
              <div className='inputSection'>
                <label htmlFor=''>Gender</label>
                <input
                  type='text'
                  value={details.fetchDetails?.sex ?? ""}
                  disabled
                />
              </div>
              <div className='inputSection'>
                <label htmlFor=''>Programme of Study</label>
                <input
                  type='text'
                  value={details.fetchDetails?.program ?? ""}
                  disabled
                />
              </div>
              <div className='inputSection'>
                <label htmlFor=''>Index Number</label>
                <input
                  type='text'
                  value={details.fetchDetails?.index_number ?? ""}
                  disabled
                />
              </div>

              <div className='inputSection'>
                <label htmlFor=''>Student Id</label>
                <input
                  type='text'
                  value={details.fetchDetails?.id ?? ""}
                  disabled
                />
              </div>
              <div className='inputSection'>
                <label htmlFor=''>Current Year</label>
                <input
                  type='text'
                  value={details.fetchDetails?.year ?? ""}
                  disabled
                />
              </div>
              <div className='inputSection'>
                <label htmlFor=''>School Email Address</label>
                <input
                  type='text'
                  value={details.fetchDetails?.school_email ?? ""}
                  disabled
                />
              </div>
              <div className='inputSection'>
                <label htmlFor=''>KNUST Mobile Number</label>
                <input
                  type='text'
                  value={details.fetchDetails?.school_vodafone_number ?? ""}
                  disabled
                />
              </div>
              <div className='inputSection'>
                <label htmlFor=''>Other Email Address</label>
                <input
                  type='text'
                  value={details.fetchDetails?.email ?? ""}
                  disabled
                />
              </div>
              <div className='inputSection'>
                <label htmlFor=''>Primary Phone Number</label>
                <input
                  type='text'
                  value={details.fetchDetails?.contact ?? ""}
                  disabled
                />
              </div>
              <div className='inputSection'>
                <label htmlFor=''>Country</label>
                <input
                  type='text'
                  value={details.fetchDetails?.country ?? ""}
                  disabled
                />
              </div>

              <div className='inputSection'>
                <label htmlFor=''>Postal Address</label>
                <input
                  type='text'
                  value={details.fetchDetails?.postal_address ?? ""}
                  disabled
                />
              </div>

              <div className='inputSection'>
                <label htmlFor=''>Residential Address</label>
                <input
                  type='text'
                  value={details.fetchDetails?.residential_address ?? ""}
                  disabled
                />
              </div>

              <div className='inputSection'>
                <label htmlFor=''>Region</label>
                <input
                  type='text'
                  value={details.fetchDetails?.region ?? ""}
                  disabled
                />
              </div>
            </form>
            <div className='buttonBox'>
              <button
                className='backBtn'
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/home");
                }}
              >
                &larr; Back To Home Page
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Updateinfo;
