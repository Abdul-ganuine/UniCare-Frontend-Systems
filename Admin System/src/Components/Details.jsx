import React, { useState } from "react";
import "./Details.css";
import profileImg from "../assets/profileImg.jpg";
import { FaDotCircle } from "react-icons/fa";

const Details = ({ details }) => {
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
    <div className="gen-profile">
      <div className="recipient-profile">
        <div className="person-main">
          <div className="sender-img">
            <img
              src={
                details?.img
                  ? `http://localhost:3000/profImages/${details?.img}`
                  : profileImg
              }
              alt=""
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
          <div className="person">
            <div className="exported-txt ">
              <p className="username-profile " style={{ textAlign: "center" }}>
                {details?.username}{" "}
              </p>
              <div className="message-profile">
                {details?.online ? (
                  <div style={{ textAlign: "center" }}>
                    <FaDotCircle size={10} color="green" /> online{" "}
                  </div>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <p>Last Seen</p>
                    <p>{getFormattedLastSeen(details?.lastSeen)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="contact-detail">
        <div className="bio-heading">Student Details</div>
        <div className="bio-btns">
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
          <div className="bio-category">
            <div className="personal">
              <div className="header">
                <p className="header-txt">Full Name</p>
                <p className="real-txt">{details?.fullname}</p>
              </div>

              <div className="header">
                <p className="header-txt">Programme of Study</p>
                <p className="real-txt">{details?.programme}</p>
              </div>

              <div className="header">
                <p className="header-txt">year</p>
                <p className="real-txt">{details?.year}</p>
              </div>

              <div className="header">
                <p className="header-txt">Hall of affiliation</p>
                <p className="real-txt">
                  {details?.hall ? details?.hall : "N/A"}
                </p>
              </div>
            </div>
            <div className="contacts"></div>
          </div>
        ) : (
          <div className="bio-category">
            <div className="personal">
              <div className="header">
                <p className="header-txt">Student ID</p>
                <p className="real-txt">{details?.student_id}</p>
              </div>

              <div className="header">
                <p className="header-txt">Contact</p>
                <p className="real-txt">{details?.contact}</p>
              </div>
              <div className="header">
                <p className="header-txt">Student's Telecel</p>
                <p className="real-txt">{details?.telecel}</p>
              </div>

              <div className="header">
                <p className="header-txt">E-mail</p>
                <p className="real-txt" style={{ textTransform: "lowercase" }}>
                  {details?.email}
                </p>
              </div>

              <div className="header">
                <p className="header-txt">Closest Person of Contact</p>
                <p className="real-txt">{details?.closestPerson}</p>
                <p className="real-txt">{details?.closestPersonContact}</p>
              </div>
            </div>
            <div className="contacts"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Details;
