import profileImage from "../assets/user.svg";
import emoji from "../assets/emoji.png";
import mic from "../assets/mic.png";
import img from "../assets/img.png";
import camera from "../assets/camera.png";
import messageImg from "../assets/prof6.jpeg";
import "./MessageRoom.css";
import EmojiPicker from "emoji-picker-react";
import { FaArrowLeft } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
function MessageRoom() {
  const [showEmojis, setShowEmojis] = useState(false);
  const [message, setMessage] = useState("");

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  function handleEmojiClick(e) {
    setMessage((prev) => prev + e.emoji);
  }
  return (
    <div className="message-room">
      <div className="message-room-top">
        <div className="userDetails">
          <img src={profileImage} alt="" />
          <div className="userDetailsText">
            <span>King James</span>
            <p>This is king James</p>
          </div>
        </div>
      </div>
      <div className="message-room-center">
        <div className="message">
          <div className="messageText">
            <p>Hello Sir</p>
            <span>6:32</span>
          </div>
        </div>
        <div className="message own">
          <div className="messageText">
            <p>Hello. How are you?</p>
            <span>6:32</span>
          </div>
        </div>
        <div className="message">
          <div className="messageText">
            <p>I'm good sir.</p>
            <span>6:32</span>
          </div>
        </div>
        <div className="message own">
          <img src={messageImg} alt="" />
          <div className="messageText">
            <p>Hello. How are you?</p>
            <span>6:32</span>
          </div>
        </div>
        <div className="message">
          <div className="messageText">
            <p>I'm good sir.</p>
            <span>6:32</span>
          </div>
        </div>
        <div ref={endRef}></div>
      </div>
      <div className="message-room-bottom">
        <div className="icons">
          <img src={img} alt="" />
          <img src={camera} alt="" />
          <img src={mic} alt="" />
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="emoji">
          <img
            src={emoji}
            alt=""
            onClick={() => setShowEmojis((prev) => !prev)}
          />
          <div className="emoji-picker">
            <EmojiPicker open={showEmojis} onEmojiClick={handleEmojiClick} />
          </div>
        </div>
        <button className="sendBtn">Send</button>
      </div>
    </div>
  );
}

export default MessageRoom;
