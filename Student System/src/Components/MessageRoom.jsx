import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";

import "./messageRoom.css";
import {
  FaPaperclip,
  FaVideo,
  FaSmile,
  FaMicrophone,
  FaPaperPlane,
} from "react-icons/fa";
import ChatMessages from "./ChatMessages";
import { GlobalContext } from "../Context/ContextApi";
import axios from "axios";

let socket;
const ENDPOINT = "http://localhost:3000";

const MessageRoom = () => {
  const [message, setMessage] = useState("");
  const [lastReceivedMessage, setLastReceivedMessage] = useState(null);
  const { chat, setChat } = useContext(GlobalContext);

  // useEffect(() => {
  //   socket = io.connect("http://localhost:3000");

  //   // Cleanup function to avoid multiple event listeners
  //   return () => {
  //     socket.off("message received");
  //     socket.disconnect(); // Properly disconnect the socket
  //   };
  // }, []);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }

    const url = "http://localhost:3000/knust.students/wellnesshub/chats/send";

    try {
      const result = await axios.post(
        url,
        { message, chatId: chat._id },
        {
          withCredentials: true,
        }
      );
      setChat(result.data);
      localStorage.setItem("selectedChat", JSON.stringify(result.data));

      socket.emit("new message", { data: result.data, chat_id: chat._id });
    } catch (error) {
      console.log(error);
    }

    setMessage(" ");
  };

  useEffect(() => {
    const savedChat = localStorage.getItem("selectedChat");
    if (savedChat) {
      setChat(JSON.parse(savedChat));
    }
  }, [setChat]);

  useEffect(() => {
    socket = io(ENDPOINT);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("message received", (newMsRecieved) => {
      console.log(newMsRecieved.data);

      setChat(newMsRecieved.data);
      localStorage.setItem("selectedChat", JSON.stringify(newMsRecieved.data));
    });
  }, [socket]);

  return (
    <div className='main-message-room'>
      <div className='message-body'>
        <ChatMessages chatMessage={chat?.messages} />
      </div>
      <div className='message-input'>
        <form className='keyboard-form'>
          <div className='typeside-icon'>
            <div className='typeside-icon-first'>
              <FaVideo className='vid-icon' size={25} cursor='pointer' />
              <FaSmile className='smile' size={25} cursor='pointer' />
            </div>

            <textarea
              type='text'
              placeholder='Type something...'
              className='message-txt'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className='text-icons'>
            <FaPaperclip cursor='pointer' size={25} />
            <FaMicrophone cursor='pointer' size={23} />
            <FaPaperPlane cursor='pointer' size={23} onClick={sendMessage} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageRoom;
