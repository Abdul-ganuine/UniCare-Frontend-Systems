import {
  FaDownload,
  FaEllipsisV,
  FaThumbsDown,
  FaThumbsUp,
  FaTimes,
} from "react-icons/fa";
import logo from "../assets/logo.jpg";

import { DefaultPlayer as Video } from "react-html5video";
import "react-html5video/dist/styles.css";
import "./singleResource.css";
import Person from "../Components/Profile";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../Context/ContextApi";
import pdfIcon from "../assets/pdf-icon.png";
import axios from "axios";

const SingleResource = () => {
  const navigate = useNavigate();
  const { roughFiles, setRoughFiles } = useContext(GlobalContext);
  const [fileIndex, setFileIndex] = useState(null);
  const [timePassed, setTimePassed] = useState(" ");
  const [comments, setComments] = useState("");

  const handleChange = (e) => {
    setComments(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
      setComments(" ");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url =
        "http://localhost:3000/knust.students/wellnesshub/tasks/library/resources/comments";
      const _id = roughFiles[fileIndex]?._id;
      const result = await axios.post(
        url,
        { comments, _id },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const timeStamp = new Date(roughFiles[fileIndex]?.createdAt);

    const updateTime = () => {
      const timeNow = new Date();
      const timedif = timeNow - timeStamp;
      setTimePassed(timedif);
    };

    const intervalId = setInterval(updateTime, 1000);

    updateTime();

    return () => clearInterval(intervalId);
  }, [roughFiles[fileIndex]?.createdAt]);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    if (days === 0) {
      // if number of hours posted is in less than an hour
      if (hours === 0) {
        if (minutes === 1) {
          return `${minutes} min ago`;
        }
        return `${minutes} mins ago`;
      }

      // if number of hours is exactly one
      if (hours === 1) {
        if (minutes === 1) {
          return `${hours} hour ${minutes} min ago`;
        }
        return `${hours} hour ${minutes} mins ago`;
      }
      return `${hours} hours ${minutes} mins ago`;
    }

    // if day is exactly one
    if (days === 1) {
      if (hours === 1) {
        return `${days} day ${hours} hour ago`;
      }
      return `${days} day ${hours} hours ago`;
    }

    // if days are more than one
    if (days > 1) {
      if (hours === 1) {
        return `${days} days ${hours} hour ago`;
      }
      return `${days} days ${hours} hours ago`;
    }
  };

  useEffect(() => {
    const savedFiles = localStorage.getItem("LibraryFiles");

    if (savedFiles) {
      setRoughFiles(JSON.parse(savedFiles));
    }
  }, [setRoughFiles]);

  useEffect(() => {
    const index = localStorage.getItem("file-index");
    if (index) {
      setFileIndex(Number(index));
    }
  }, []);

  return (
    <div>
      <nav className='library-menu'>
        <div className='library-menu-1-container'>
          <div className='library-side-logo'>
            <div>
              <img src={logo} alt='' style={{ width: "50px" }} />
            </div>
            <p className='library-title'>Resource Library</p>
          </div>

          <FaTimes
            style={{ margin: "20px 30px 0 0", cursor: "pointer" }}
            onClick={() => navigate("/library")}
          />
        </div>
      </nav>

      <div className='single-resource-all'>
        <div className='resource-content'>
          <div className='file-txt'>
            <div className='single-Resource-prof'>
              <div className='single-Resource-prof-leftside'>
                <Person
                  img={`http://localhost:3000/profImages/${roughFiles[fileIndex]?.prof}`}
                />
                <p className='author' style={{ marginTop: "10px" }}>
                  {roughFiles[fileIndex]?.author}
                </p>
              </div>
              <FaEllipsisV style={{ cursor: "pointer" }} />
            </div>

            <div>
              <p
                className='file-txt-title'
                style={{
                  textAlign: "center",
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                }}
              >
                {roughFiles[fileIndex]?.title}
              </p>
              <p
                style={{
                  textAlign: "center",
                }}
              >
                Published: {formatTime(timePassed)}
              </p>
            </div>
          </div>

          <div className='resource-text' style={{ whiteSpace: "pre-wrap" }}>
            {roughFiles[fileIndex]?.desc}
          </div>
          <div className='file-box'>
            <div>
              {roughFiles[fileIndex]?.img && (
                <>
                  <img
                    src={`http://localhost:3000/imageFiles/${roughFiles[fileIndex]?.img}`}
                    alt=''
                    style={{ width: "100%" }}
                  />
                  <div
                    className='download-btn'
                    onClick={() =>
                      handleDownload(
                        `http://localhost:3000/imageFiles/${roughFiles[fileIndex]?.img}`,
                        roughFiles[fileIndex]?.img
                      )
                    }
                  >
                    <FaDownload />
                    <p>Download File</p>
                  </div>
                </>
              )}
            </div>

            <div>
              {roughFiles[fileIndex]?.vid && (
                <>
                  <Video
                    loop
                    poster=''
                    style={{ width: "100%", height: "100%" }}
                  >
                    <source
                      src={`http://localhost:3000/videoFiles/${roughFiles[fileIndex]?.vid}`}
                      type='video/webm'
                    />
                  </Video>
                  <div
                    className='download-btn'
                    onClick={() =>
                      handleDownload(
                        `http://localhost:3000/videoFiles/${roughFiles[fileIndex]?.vid}`,
                        roughFiles[fileIndex]?.vid
                      )
                    }
                  >
                    <FaDownload />
                    <p>Download File</p>
                  </div>
                </>
              )}
            </div>

            <div>
              {roughFiles[fileIndex]?.pdf && (
                <>
                  <div>{roughFiles[fileIndex]?.pdf}</div>
                  <img
                    src={pdfIcon}
                    alt=''
                    width={100}
                    style={{ borderRadius: "10px" }}
                  />
                  <p>{roughFiles[fileIndex]?.pdfOriginalName}</p>
                  <div
                    className='download-btn'
                    onClick={() =>
                      handleDownload(
                        `http://localhost:3000/docFiles/${roughFiles[fileIndex]?.pdf}`,
                        roughFiles[fileIndex]?.pdf
                      )
                    }
                  >
                    <FaDownload />
                    <p>Download File</p>
                  </div>
                </>
              )}
            </div>

            <div>
              {roughFiles[fileIndex]?.audio && (
                <>
                  <audio controls>
                    <source
                      src={`http://localhost:3000/audioFiles/${roughFiles[fileIndex]?.audio}`}
                      type='audio/mp3'
                    ></source>
                  </audio>

                  <div
                    className='download-btn'
                    onClick={() =>
                      handleDownload(
                        `http://localhost:3000/audioFiles/${roughFiles[fileIndex]?.audio}`,
                        roughFiles[fileIndex]?.audio
                      )
                    }
                  >
                    <FaDownload />
                    <p>Download File</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className='comment-section'>
          <div className='comment-input-box'>
            <form action='' onSubmit={handleSubmit}>
              <p>add comment here</p>
              <textarea
                type='text'
                value={comments}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder='Your comment will be public and anyone can see it'
              />
            </form>
          </div>

          <div className='comment-texts'>
            <p className='comments-heading'> comments</p>

            {roughFiles[fileIndex]?.comments?.map(
              ({ name, commentProf, createdAt, text }, index) => {
                return (
                  <div style={{ marginBottom: "50px" }} key={index}>
                    <div className='single-Resource-prof'>
                      <div className='single-Resource-prof-leftside'>
                        <Person
                          img={`http://localhost:3000/profImages/${commentProf}`}
                        />
                        <p style={{ marginTop: "10px", fontWeight: "bold" }}>
                          {name}
                        </p>
                      </div>
                      <p style={{ marginTop: "10px" }}>{createdAt}</p>
                    </div>
                    <div
                      className='comments-info'
                      style={{ paddingInline: "20px" }}
                    >
                      {text}
                    </div>
                    <div className='react-buttons'>
                      <div className='up-reactions'>
                        <FaThumbsUp style={{ cursor: "pointer" }} />
                        <p className='up-value'>1</p>
                      </div>
                      <div className='up-reactions'>
                        <FaThumbsDown style={{ cursor: "pointer" }} />
                        <p className='up-value'>1</p>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SingleResource;
