import { createContext, useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
// import Peer from "simple-peer";

export const GlobalContext = createContext();

const socket = io("http://localhost:3000");

const GlobalContextProvider = ({ children }) => {
  // video call side functions
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState(" ");
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();

  // useEffect(() => {
  //   navigator.mediaDevices
  //     .getUserMedia({ video: true, audio: true })
  //     .then((currentStream) => {
  //       setStream(currentStream);

  //       myVideo.current.srcObject = currentStream;
  //     });

  //   socket.on("me", (id) => setMe(id));

  //   socket.on("calluser", ({ from, name: callerName, signal }) => {
  //     setCall({ isReceivedCall: true, from, name: callerName, signal });
  //   });
  // }, []);

  // answering a call
  // const answerCall = () => {
  //   setCallAccepted(true);
  //   const peer = new Peer({ initiator: false, trickle: false, stream });
  //   peer.on("signal", (data) => {
  //     socket.emit("answercall", { signal: data, to: call.from });
  //   });

  //   peer.on("stream", (currentStream) => {
  //     userVideo.current.srcObject = currentStream;
  //   });

  //   peer.signal(call.signal);
  // };
  // const callUser = () => {};
  // const leaveCall = () => {};

  const [details, setDetails] = useState({
    username: "",
    student_id: "",
    staff_id: "",
    password: "",
    email: "",
  });

  const [sized, setSized] = useState(false);
  const [token, setToken] = useState(null);
  const [fileIndex, setFileIndex] = useState(null);
  const [profImage, setProfImage] = useState(null);
  const [timesClicked, setTimesClicked] = useState(false);
  const [displayUserInfo, setDisplayUserInfo] = useState(false);

  const [updateProfile, setUpdateProfile] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [files, setFiles] = useState([]);
  const handleResizing = useCallback(() => {
    if (window.innerWidth < 1023) {
      setSized(true);
    } else {
      setSized(false);
    }
  }, []);

  // chat side variables
  const [chat, setChat] = useState(() => {
    const savedChat = localStorage.getItem("selectedChat");
    return savedChat ? JSON.parse(savedChat) : null;
  });

  const [participantDetails, setParticipantDetails] = useState(() => {
    const savedChat = localStorage.getItem("selectedChatDetails");
    return savedChat ? JSON.parse(savedChat) : null;
  });

  const [roughFiles, setRoughFiles] = useState(() => {
    const savedFiles = localStorage.getItem("LibraryFiles");
    return savedFiles ? JSON.parse(savedFiles) : null;
  });

  useEffect(() => {
    if (chat) {
      localStorage.setItem("selectedChat", JSON.stringify(chat));
      localStorage.setItem(
        "selectedChatDetails",
        JSON.stringify(participantDetails)
      );
    }
  }, [chat]);

  useEffect(() => {
    if (roughFiles) {
      localStorage.setItem("LibraryFiles", JSON.stringify(roughFiles));
    }
  }, [roughFiles]);

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <GlobalContext.Provider
      value={{
        sized,
        setSized,
        token,
        setToken,
        files,
        setFiles,
        chat,
        setChat,
        roughFiles,
        setRoughFiles,
        fileIndex,
        setFileIndex,
        handleResizing,
        details,
        setDetails,
        profImage,
        setProfImage,
        currentUser,
        setCurrentUser,
        updateProfile,
        setUpdateProfile,
        participantDetails,
        setParticipantDetails,
        timesClicked,
        setTimesClicked,
        displayUserInfo,
        setDisplayUserInfo,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
