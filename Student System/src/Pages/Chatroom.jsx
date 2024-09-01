import React, { useCallback, useContext, useEffect, useState } from "react";
import "./chatroom.css";
import NavBar from "../Components/ChatNavBar";
import UserInfoPage from "../Components/UserInfoPage";
import "../Components/messageRoom.css";
import "../Components/leftbar.css";
import prof from "../assets/defaultProf.jpg";
import {
  FaPaperclip,
  FaVideo,
  FaSmile,
  FaMicrophone,
  FaPaperPlane,
  FaSearch,
  FaTimes,
  FaAudioDescription,
  FaImage,
} from "react-icons/fa";
import ChatMessages from "../Components/ChatMessages";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import { GlobalContext } from "../Context/ContextApi";
import axios from "axios";
import Person from "../Components/Profile";
import { MdDescription } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ENDPOINT = "http://localhost:3000";
let socket, compareChat;

// Debounce function definition
const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
};

const Chatroom = () => {
  const [socketConnected, setSocketConnected] = useState(false);
  const {
    sized,
    handleResizing,
    currentUser,
    chat,
    setChat,
    participantDetails,
    setParticipantDetails,
    timesClicked,
    setTimesClicked,
    displayUserInfo,
  } = useContext(GlobalContext);

  const [doc, setDoc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [flip, setFlip] = useState(false);
  const navigate = useNavigate();

  // setting up the socket.io for the real-time communication
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", currentUser._id);
    socket.on("connection", () => setSocketConnected(true));
  }, []);
  let mediaRecorder;
  let audioChunks = [];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        setAudioBlob(audioBlob); // Save the Blob to state
        audioChunks = []; // Reset the chunks array
      };

      mediaRecorder.start();
      console.log("MediaRecorder started:", mediaRecorder.state); // Log state
      setIsRecording(true); // Update the state to reflect that recording has started
    } catch (error) {
      console.error("Error accessing microphone", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      console.log("MediaRecorder stopped:", mediaRecorder.state); // Log state
      setIsRecording(false); // Update the state to reflect that recording has stopped
    } else {
      console.error("MediaRecorder is not initialized or already stopped");
    }
  };

  // Update the handleEmojiClick function
  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  // Adjust the toggleEmojiPicker function to prevent unnecessary renders
  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker((prev) => !prev);
  }, []);

  // send message after typing
  const sendMessage = async (event) => {
    event.preventDefault();
    if (
      message.trim() === "" &&
      !audioBlob &&
      !doc &&
      !audioFile &&
      !videoFile &&
      !imageFile
    ) {
      alert("Enter valid message");
      return;
    }

    let vid, aud, img, pdf, pdfSize, pdfOriginalName, voiceNote;

    const formData1 = new FormData();
    const formData2 = new FormData();
    const formData3 = new FormData();
    const formData4 = new FormData();

    formData1.append("doc", doc);
    formData2.append("audio", audioFile);
    formData3.append("video", videoFile);
    formData4.append("image", imageFile);

    const urlResources = "http://localhost:3000/library/resources";
    const url =
      "http://localhost:3000/knust.students/wellnesshub/chats/sendVoiceNote";

    const urlSendMessage =
      "http://localhost:3000/knust.students/wellnesshub/chats/send";

    // for voice note
    if (audioBlob) {
      const formData = new FormData();
      formData.append("voiceNote", audioBlob, "voiceNote.wav");
      try {
        const result = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        voiceNote = result.data;
      } catch (error) {
        console.log(error);
      }
    }

    // for video
    if (videoFile) {
      try {
        const result = await axios.post(`${urlResources}/video`, formData3, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        vid = result.data.vid;
      } catch (error) {
        console.log(error);
      }
    }

    // for audio
    if (audioFile) {
      try {
        const result = await axios.post(`${urlResources}/audio`, formData2, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        aud = result.data.audio;
      } catch (error) {
        console.log(error);
      }
    }

    // for documents
    if (doc) {
      try {
        const result = await axios.post(`${urlResources}/doc`, formData1, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        pdf = result.data.doc;
        pdfOriginalName = result.data.pdfOriginalName;
        pdfSize = result.data.pdfSize;
      } catch (error) {
        console.log(error);
      }
    }

    // for image files
    if (imageFile) {
      try {
        const result = await axios.post(`${urlResources}/image`, formData4, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        img = result.data.img;
      } catch (error) {
        console.log(error);
      }
    }

    try {
      const result = await axios.post(
        urlSendMessage,
        {
          message,
          chatId: chat._id,
          voiceNote,
          vid,
          aud,
          img,
          pdf,
          pdfOriginalName,
          pdfSize,
          id: currentUser._id,
        },
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

    setMessage("");
    setAudioBlob(null);
    setFlip(false);
    setImageFile(null);
    setAudioFile(null);
    setVideoFile(null);
    setDoc(null);
  };

  // perform a search query
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    handleResizing();
    window.addEventListener("resize", handleResizing);

    return () => {
      window.removeEventListener("resize", handleResizing);
    };
  }, [handleResizing]);

  // clicking and selecting a user to chat with on the left side bar
  const handleChatSelect = async (id) => {
    const url = "http://localhost:3000/knust.students/wellnesshub/chats";
    try {
      const result = await axios.post(
        url,
        { userId: id, id: currentUser._id },
        {
          withCredentials: true,
        }
      );

      // Update selected chat and participant details
      setChat(result.data.chat);
      setParticipantDetails(result.data.details);

      // Store in local storage
      localStorage.setItem("selectedChat", JSON.stringify(result.data.chat));
      localStorage.setItem(
        "selectedChatDetails",
        JSON.stringify(result.data.details)
      );

      compareChat = result.data.chat;
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch users with debounce
  const fetchUsers = useCallback(
    debounce(async (query) => {
      try {
        const result = await axios.get(
          `http://localhost:3000/knust.students/wellnesshub/tasks/getusers?search=${query}`,
          { withCredentials: true }
        );
        setUsers(result.data);
      } catch (error) {
        console.log(error);
      }
    }, 300),
    [] // Will be created only once
  );

  useEffect(() => {
    fetchUsers(searchQuery);
  }, [searchQuery, fetchUsers]);

  useEffect(() => {
    const savedChat = localStorage.getItem("selectedChat");
    const savedDetails = localStorage.getItem("selectedChatDetails");
    if (savedChat) {
      setChat(JSON.parse(savedChat));
      setParticipantDetails(JSON.parse(savedDetails));
    }
  }, [setChat]);

  useEffect(() => {
    if (chat && chat._id) {
      socket.emit("join chat", chat._id);
    }
  }, [chat]);

  useEffect(() => {
    socket.on("message received", (newMsRecieved) => {
      // if (!compareChat || compareChat !== newMsRecieved.chat_id) {
      //   // notification here
      // } else {
      //   console.log(newMsRecieved.data);

      // }

      setChat(newMsRecieved.data);
      localStorage.setItem("selectedChat", JSON.stringify(newMsRecieved.data));
    });
  }, [socket]);

  return (
    <div className='chat-main'>
      <div className='nav'>
        <NavBar />
      </div>

      <div className='chat-body'>
        <div
          className={
            sized
              ? timesClicked
                ? "left-side-bar-hidden"
                : "left-side-bar "
              : "left-side-bar "
          }
        >
          <div className='.main-sidebar'>
            <div className='left-search-bar'>
              <FaSearch className='search-icon' />
              <input
                type='text'
                placeholder='search'
                className='input'
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
            </div>

            <div className='users-lodge'>
              {users?.map(({ username, img, time, message, _id }, index) => (
                <div
                  className='users'
                  style={{ cursor: "pointer" }}
                  key={index}
                  onClick={() => {
                    handleChatSelect(_id);
                    setTimesClicked(true);
                  }}
                >
                  <div className='single-user'>
                    <Person
                      img={
                        img ? `http://localhost:3000/profImages/${img}` : prof
                      }
                    />
                    <div className='msg-txt-time'>
                      <div className='person-txt-info'>
                        <p className='msg-username'>{username}</p>
                        <p className='msg'>{message}</p>
                      </div>
                      <p className='time'>{time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <>
          {chat ? (
            <div className='right-side-bar'>
              <div className='msg-space'>
                <div className='main-message-room'>
                  <div className='message-body'>
                    <ChatMessages chatMessage={chat?.messages} />
                  </div>

                  <div className='message-input'>
                    {flip && (
                      <div className='docs-implementation'>
                        <div className='document-fa-div-singles'>
                          <label htmlFor='doc' style={{ width: "80px" }}>
                            <MdDescription size={20} color='grey' />
                            <div>
                              <p>docs</p>
                              <p style={{ fontSize: "0.7rem", color: "grey" }}>
                                {doc ? doc.name : ""}
                              </p>
                            </div>
                          </label>
                          <input
                            type='file'
                            name='doc'
                            id='doc'
                            accept='.pdf,.doc,.docx,.ppt'
                            onChange={(e) => {
                              setDoc(e.target.files[0]);
                            }}
                          />
                          {doc && (
                            <FaTimes
                              color='grey'
                              style={{ cursor: "pointer" }}
                              onClick={() => setDoc(null)}
                            />
                          )}
                        </div>
                        <div className='document-fa-div-singles'>
                          <label htmlFor='img' style={{ width: "90px" }}>
                            <FaImage size={20} color='grey' />
                            <div>
                              <p>image</p>
                              <p style={{ fontSize: "0.7rem", color: "grey" }}>
                                {imageFile ? imageFile.name : ""}
                              </p>
                            </div>
                          </label>
                          <input
                            type='file'
                            name='img'
                            id='img'
                            accept='image/*'
                            onChange={(e) => setImageFile(e.target.files[0])}
                          />
                          {imageFile && (
                            <FaTimes
                              color='grey'
                              style={{ cursor: "pointer" }}
                              onClick={() => setImageFile(null)}
                            />
                          )}
                        </div>
                        <div className='document-fa-div-singles'>
                          <label htmlFor='aud' style={{ width: "80px" }}>
                            <FaAudioDescription size={20} color='grey' />
                            <div>
                              <p>audio</p>
                              <p style={{ fontSize: "0.7rem", color: "grey" }}>
                                {audioFile ? audioFile.name : ""}
                              </p>
                            </div>
                          </label>
                          <input
                            type='file'
                            name='audio'
                            id='aud'
                            accept='audio/*'
                            onChange={(e) => setAudioFile(e.target.files[0])}
                          />
                          {audioFile && (
                            <FaTimes
                              color='grey'
                              style={{ cursor: "pointer" }}
                              onClick={() => setAudioFile(null)}
                            />
                          )}
                        </div>
                        <div className='document-fa-div-singles'>
                          <label htmlFor='vid' style={{ width: "80px" }}>
                            <FaVideo size={20} color='grey' />
                            <div>
                              <p>video</p>
                              <p style={{ fontSize: "0.7rem", color: "grey" }}>
                                {videoFile ? videoFile.name : ""}
                              </p>
                            </div>
                          </label>
                          <input
                            type='file'
                            name='vid'
                            id='vid'
                            accept='video/*'
                            onChange={(e) => setVideoFile(e.target.files[0])}
                          />
                          {videoFile && (
                            <FaTimes
                              color='grey'
                              style={{ cursor: "pointer" }}
                              onClick={() => setVideoFile(null)}
                            />
                          )}
                        </div>
                      </div>
                    )}
                    <form className='keyboard-form'>
                      <div className='typeside-icon'>
                        <div className='typeside-icon-first'>
                          <FaVideo
                            className='vid-icon'
                            size={25}
                            cursor='pointer'
                            onClick={() => navigate("/videoCall")}
                          />
                          <FaSmile
                            className='smile'
                            size={25}
                            cursor='pointer'
                            onClick={toggleEmojiPicker}
                          />
                          {showEmojiPicker && (
                            <div className='emoji-picker'>
                              <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </div>
                          )}
                        </div>

                        <textarea
                          type='text'
                          placeholder='Type something...'
                          className='message-txt'
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          disabled={isRecording}
                        />
                      </div>
                      <div className='text-icons'>
                        <FaPaperclip
                          cursor='pointer'
                          size={25}
                          onClick={() => setFlip(!flip)}
                        />
                        <FaMicrophone
                          cursor='pointer'
                          size={23}
                          onMouseDown={startRecording}
                          onMouseUp={stopRecording}
                          style={{
                            cursor: "pointer",
                            opacity: isRecording ? 0.5 : 1,
                          }}
                        />
                        <FaPaperPlane
                          cursor='pointer'
                          size={23}
                          onClick={sendMessage}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div
                className={
                  sized
                    ? displayUserInfo
                      ? "info-room-toggle"
                      : "info-room-toggle-hide"
                    : "info-room"
                }
              >
                <UserInfoPage details={participantDetails} />
              </div>
            </div>
          ) : (
            <div className='emptytextarea '>
              <h5 className='hi-heading'>
                Hi👋 ,This is{" "}
                <span style={{ color: "green", fontWeight: "bolder" }}>
                  uniCare
                </span>
              </h5>
              <p className='hi-txt'>
                pick your preferred consultant, let's get interactive.
              </p>
              c
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default Chatroom;
