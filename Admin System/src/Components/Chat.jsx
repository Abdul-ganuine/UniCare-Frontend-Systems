import "./Chat.css";
import Details from "./Details";
import profileImage from "../assets/user.svg";
import emoji from "../assets/emoji.png";
import mic from "../assets/mic.png";
import img from "../assets/img.png";
import camera from "../assets/camera.png";
import "./MessageRoom.css";
import EmojiPicker from "emoji-picker-react";
import { DefaultPlayer as Video } from "react-html5video";
import "react-html5video/dist/styles.css";
import { AiOutlineArrowLeft } from "react-icons/ai";
import "./ChatSidebar.css";
import "./Chatlist.css";
import io from "socket.io-client";
import axios from "axios";
import { useSelector } from "react-redux";
import { MdDescription } from "react-icons/md";
import {
  FaAudioDescription,
  FaImage,
  FaMicrophone,
  FaPaperclip,
  FaPaperPlane,
  FaSmile,
  FaTimes,
  FaVideo,
} from "react-icons/fa";
import pdfIcon from "../assets/pdf-icon.png";

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

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "../Context/ContextApi";

function Chat({ userName, role }) {
  const [showEmojis, setShowEmojis] = useState(false);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatVisible, setChatVisible] = useState(false);
  const [chatInitiated, setChatInitiated] = useState(false);
  const [flip, setFlip] = useState(false);
  const [doc, setDoc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  // Event handlers for file inputs
  const handleImageChange = (e) => setImageFile(e.target.files[0]);
  const handleVideoChange = (e) => setVideoFile(e.target.files[0]);
  const handleAudioChange = (e) => setAudioFile(e.target.files[0]);
  const handleDocChange = (e) => setDoc(e.target.files[0]);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const {
    currentUser,
    chat,
    setChat,
    participantDetails,
    setParticipantDetails,

    displayUserInfo,
  } = useContext(GlobalContext);
  const { user } = useSelector((state) => state.user);
  console.log(user);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
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

  function handleEmojiClick(e) {
    setMessage((prev) => prev + e.emoji);
  }

  const Id = localStorage.getItem("userId");

  // setting up the socket.io for the real-time communication
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", Id);
    socket.on("connection");
  }, []);

  const sendMessage = async (event) => {
    event.preventDefault();

    // i implemented the validation checks inside the send button so that if nothing at is selected, it does not trigger when clicked on.

    let vid, aud, img, pdf, pdfSize, pdfOriginalName, voiceNote;

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
        console.log(voiceNote);
      } catch (error) {
        console.log(error);
      }
    }

    // for video
    if (videoFile) {
      const formData3 = new FormData();
      formData3.append("video", videoFile);
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
      const formData2 = new FormData();
      formData2.append("audio", audioFile);
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
      const formData1 = new FormData();
      formData1.append("doc", doc);
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
      const formData4 = new FormData();
      formData4.append("image", imageFile);
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
          id: localStorage.getItem("userId"),
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

  // Function to fetch users with debounce
  const fetchUsers = useCallback(
    debounce(async (query) => {
      try {
        const result = await axios.get(
          `http://localhost:3000/knust.students/wellnesshub/tasks/getStudents?search=${query}`,
          { withCredentials: true }
        );
        setUsers(result.data);
        console.log(result.data);
      } catch (error) {
        console.log(error);
      }
    }, 300),
    [] // Will be created only once
  );

  useEffect(() => {
    fetchUsers(searchQuery);
  }, [searchQuery, fetchUsers]);

  // clicking and selecting a user to chat with on the left side bar
  const handleChatSelect = async (id) => {
    const url = "http://localhost:3000/knust.students/wellnesshub/chats";
    try {
      const result = await axios.post(
        url,
        { userId: id, id: localStorage.getItem("userId") },
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

      setChatVisible(true);
      setChatInitiated(true);

      compareChat = result.data.chat;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const savedChat = localStorage.getItem("selectedChat");
    const savedDetails = localStorage.getItem("selectedChatDetails");
    if (savedChat) {
      setChat(JSON.parse(savedChat));
      setParticipantDetails(JSON.parse(savedDetails));
    }

    console.log(chat);
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

  const chatMessage = chat?.messages || [];

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, message) => {
      const messageDate = new Date(message.timestamp).toLocaleDateString();

      if (!acc[messageDate]) {
        acc[messageDate] = [];
      }

      acc[messageDate].push(message);
      return acc;
    }, {});
  };

  // Format dates
  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);

    const isToday = messageDate.toDateString() === today.toDateString();
    const isYesterday =
      messageDate.toDateString() ===
      new Date(today.setDate(today.getDate() - 1)).toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    return messageDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const groupedMessages = groupMessagesByDate(chatMessage);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date
      .toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
  };

  return (
    <div className='chat'>
      {/* Chat sidebar code */}
      <div
        className={`chat-sidebar ${chatVisible ? "chatsidebar-hidden" : null}`}
      >
        <div className='chatlist'>
          <div className='chatlist-search-bar'>
            <input
              type='search'
              className='chatlist-search'
              placeholder='Search🔍'
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </div>

          {users?.map(({ username, img, time, message, _id }, index) => (
            <div
              className='userItem'
              onClick={() => handleChatSelect(_id)}
              key={index}
            >
              <img
                src={
                  img
                    ? ` http://localhost:3000/profImages/${img}`
                    : profileImage
                }
                alt=''
              />
              <div className='userText'>
                <span>{username}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Room code */}
      {chatInitiated ? (
        <>
          <div
            className={`message-room ${
              chatVisible ? "" : "message-room-hidden"
            }`}
          >
            <div className='message-room-top'>
              <div className='userDetails'>
                <img src={profileImage} alt='' />
                <div className='userDetailsText'>
                  <span>{userName}</span>
                  <p>{role}</p>
                </div>
              </div>
              <div
                className='back sendBtn'
                onClick={() => setChatVisible(false)}
              >
                <AiOutlineArrowLeft />
              </div>
            </div>
            <div className='message-room-center'>
              {Object.keys(groupedMessages).map((date, index) => (
                <div key={index}>
                  <div className='date-header'>{formatDate(date)}</div>
                  {groupedMessages[date].map(
                    (
                      {
                        text,
                        timestamp,
                        sender,
                        voiceNote,
                        pdfOriginalName,
                        pdfSize,
                        vid,
                        img,
                        aud,
                        pdf,
                      },
                      index
                    ) => (
                      <div className='di-messages' key={index}>
                        <div
                          className={sender._id === Id ? "sender" : "receiver"}
                        >
                          {text && (
                            <p style={{ whiteSpace: "pre-wrap" }}>{text}</p>
                          )}
                          {voiceNote && (
                            <audio
                              controls
                              src={`http://localhost:3000/audioFiles/${voiceNote}`}
                            ></audio>
                          )}

                          {aud && (
                            <audio
                              controls
                              src={`http://localhost:3000/audioFiles/${aud}`}
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
                              <div>{pdfOriginalName}</div>
                              <div
                                style={{ fontSize: "0.7rem", color: "grey" }}
                              >
                                {pdfSize}kb
                              </div>
                            </div>
                          )}
                          <div>{formatTimestamp(timestamp)}</div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ))}

              <div ref={endRef}></div>
            </div>
            <div className='message-room-bottom'>
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
                      name=''
                      id='doc'
                      accept='.pdf,.doc,.docx,.ppt'
                      onChange={handleDocChange}
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
                      id='img'
                      accept='image/*'
                      onChange={handleImageChange}
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
                      onChange={handleAudioChange}
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
                      name=''
                      id='vid'
                      accept='video/*'
                      onChange={handleVideoChange}
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

              <div className='icons'>
                <FaPaperclip
                  onClick={() => setFlip(!flip)}
                  color='grey'
                  cursor='pointer'
                  size={20}
                />
                <FaVideo color='grey' cursor='pointer' size={20} />
                <FaMicrophone
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  style={{ cursor: "pointer", opacity: isRecording ? 0.5 : 1 }}
                  color='grey'
                  size={20}
                />
              </div>

              <textarea
                type='text'
                placeholder='Type a message...'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isRecording}
              />

              <div className='emoji'>
                <FaSmile
                  onClick={() => setShowEmojis((prev) => !prev)}
                  style={{ opacity: isRecording ? 0.5 : 1 }}
                  color='grey'
                  cursor='pointer'
                  size={20}
                />
                <div className='emoji-picker'>
                  <EmojiPicker
                    open={showEmojis}
                    onEmojiClick={handleEmojiClick}
                  />
                </div>
              </div>
              <button
                className='sendBtn'
                onClick={sendMessage}
                disabled={
                  !message.trim() &&
                  !audioBlob &&
                  !doc &&
                  !audioFile &&
                  !videoFile &&
                  !imageFile
                }
              >
                Send
              </button>
            </div>
          </div>
        </>
      ) : (
        <div
          className={`message-room chat-welcome ${
            chatVisible ? "" : "message-room-hidden"
          }`}
        >
          Welcome👋Start a chat.
        </div>
      )}

      {chatInitiated && <Details details={participantDetails} />}
    </div>
  );
}

export default Chat;
