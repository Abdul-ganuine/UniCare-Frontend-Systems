import React, { useContext } from "react";
import { DefaultPlayer as Video } from "react-html5video";
import "react-html5video/dist/styles.css";
import "./singlechat.css";
import { GlobalContext } from "../Context/ContextApi";
import pdfIcon from "../assets/pdf-icon.png";

const SingleChat = ({
  sender,
  text,
  timestamp,
  voiceNote,
  vid,
  aud,
  img,
  pdf,
  pdfOriginalName,
  pdfSize,
}) => {
  const { currentUser } = useContext(GlobalContext);

  // Convert the timestamp to a Date object and format it
  let formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Convert AM/PM to lowercase
  formattedTime = formattedTime.replace("AM", "am").replace("PM", "pm");

  return (
    <div className='chat-messages' style={{ whiteSpace: "pre-wrap" }}>
      {text && (
        <div
          className={sender._id === currentUser._id ? "text-Box" : "text-Box1"}
        >
          {text}
        </div>
      )}

      {voiceNote && (
        <audio
          controls
          src={`http://localhost:3000/audioFiles/${voiceNote}`}
          type='audio/mp3'
          className={sender._id === currentUser._id ? "text-Box" : "text-Box1"}
          style={{ cursor: "pointer" }}
        ></audio>
      )}

      {aud && (
        <audio
          controls
          src={`http://localhost:3000/audioFiles/${aud}`}
          className={sender._id === currentUser._id ? "text-Box" : "text-Box1"}
          style={{ cursor: "pointer" }}
        ></audio>
      )}

      {vid && (
        <div style={{ borderRadius: "10px" }}>
          <Video loop poster='' style={{ width: "300px" }}>
            <source
              src={`http://localhost:3000/videoFiles/${vid}`}
              type='video/webm'
            />
          </Video>
        </div>
      )}

      {img && (
        <div>
          <img
            src={`http://localhost:3000/imageFiles/${img}`}
            alt=''
            width={300}
            style={{ borderRadius: "10px" }}
          />
        </div>
      )}

      {pdf && (
        <div>
          <img
            src={pdfIcon}
            alt=''
            width={100}
            style={{ borderRadius: "10px" }}
          />
          <p>{pdfOriginalName}</p>
          <p style={{ fontSize: "0.7rem", color: "grey" }}>{pdfSize}kb</p>
        </div>
      )}

      <div className='chat-time'>{formattedTime}</div>
    </div>
  );
};

export default SingleChat;
