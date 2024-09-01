import { createContext, useCallback, useEffect, useState } from "react";

export const GlobalContext = createContext();

const GlobalContextProvider = ({ children }) => {
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
  const [status, setStatus] = useState(() => {
    const savedUser = localStorage.getItem("status");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [updateProfile, setUpdateProfile] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [files, setFiles] = useState([]);
  const [roughFiles, setRoughFiles] = useState([]);

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
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <GlobalContext.Provider
      value={{
        sized,
        setSized,
        token,
        setToken,
        status,
        setStatus,
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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
