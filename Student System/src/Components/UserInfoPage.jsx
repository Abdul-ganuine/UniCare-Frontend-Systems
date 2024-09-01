import React, { useState } from "react";
import "./userInfo.css";
import prof from "../assets/defaultProf.jpg";
import { FaDotCircle } from "react-icons/fa";

const UserInfoPage = ({ details }) => {
  const [isClicked, setIsClicked] = useState(true);

  const handleSwitchPersonal = () => {
    setIsClicked(true);
  };

  const handleSwitchContact = () => {
    setIsClicked(false);
  };

  // Function to get formatted date string
  const getFormattedLastSeen = (lastSeen) => {
    const lastSeenDate = new Date(lastSeen);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = lastSeenDate.toDateString() === today.toDateString();
    const isYesterday =
      lastSeenDate.toDateString() === yesterday.toDateString();

    let datePrefix;
    if (isToday) {
      datePrefix = "Today";
    } else if (isYesterday) {
      datePrefix = "Yesterday";
    } else {
      const dayName = lastSeenDate.toLocaleDateString(undefined, {
        weekday: "long",
      });
      const fullDate = lastSeenDate.toLocaleDateString();
      datePrefix = `${dayName}, ${fullDate}`;
    }

    // Format time
    let formattedTime = lastSeenDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    formattedTime = formattedTime.replace("AM", "am").replace("PM", "pm");

    return `${datePrefix} at ${formattedTime}`;
  };

  return (
    <div className='gen-profile'>
      <div className='recipient-profile'>
        <div className='person-main'>
          <div className='sender-img'>
            <img
              src={
                details?.img
                  ? `http://localhost:3000/profImages/${details?.img}`
                  : prof
              }
              alt=''
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
          <div className='person'>
            <div className='exported-txt '>
              <p className='username-profile '>{details?.username} </p>
              <div className='message-profile'>
                {details?.online ? (
                  <div>
                    <FaDotCircle size={10} color='green' /> online{" "}
                  </div>
                ) : (
                  <div>
                    <p>Last Seen</p>
                    <p>{getFormattedLastSeen(details?.lastSeen)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='contact-detail'>
        <div className='bio-heading'>Bio</div>
        <div className='bio-btns'>
          <button
            onClick={handleSwitchPersonal}
            className={isClicked ? "child-btn-visited" : "child-btn"}
          >
            Personal
          </button>
          <button
            onClick={handleSwitchContact}
            className={!isClicked ? "child-btn-visited" : "child-btn"}
          >
            Contact
          </button>
        </div>

        {isClicked ? (
          <div className='bio-category'>
            <div className='personal'>
              <div className='header'>
                <p className='header-txt'>Full Name</p>
                <p className='real-txt'>{details?.fullname}</p>
              </div>
              <div className='header'>
                <p className='header-txt'>Role</p>
                <p className='real-txt'>{details?.role}</p>
              </div>
              <div className='header'>
                <p className='header-txt'>Specialization</p>
                <p className='real-txt'>{details?.specialty}</p>
              </div>
              <div className='header'>
                <p className='header-txt'>
                  {details?.role === "doctor" ? " Hospital" : "Station"}
                </p>
                <p className='real-txt'>
                  {details?.role === "doctor"
                    ? "Knust Hospital"
                    : "Knust Counselling Center"}
                </p>
              </div>
              <div className='header'>
                <p className='header-txt'>Office</p>
                <p className='real-txt'>
                  {details?.role === "doctor" ? `Room 32` : `Room 12`}
                </p>
              </div>
            </div>
            <div className='contacts'></div>
          </div>
        ) : (
          <div className='bio-category'>
            <div className='personal'>
              <div className='header'>
                <p className='header-txt'>Contact</p>
                <p className='real-txt'>{details?.contact}</p>
              </div>

              <div className='header'>
                <p className='header-txt'>E-mail</p>
                <p className='real-txt' style={{ textTransform: "lowercase" }}>
                  {details?.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className='appointment'>
        <p className='appointment-heading'>Book an Appointment</p>

        <p className='next'>
          click <span>next</span> to continue
        </p>
      </div>
    </div>
  );
};

export default UserInfoPage;
