import {
  FaAngleDown,
  FaAngleUp,
  FaBookReader,
  FaCheck,
  FaCommentAlt,
  FaEllipsisV,
  FaSearch,
  FaThumbsUp,
  FaTrash,
} from "react-icons/fa";

import logo from "../assets/logo.jpg";
import Person from "../Components/Profile";
import prof from "../assets/defaultProf.jpg";
import pdfIcon from "../assets/pdf-icon.png";
import libraryDefault from "../assets/libraryDefault.png";
import "./Library.css";

import { DefaultPlayer as Video } from "react-html5video";
import "react-html5video/dist/styles.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../Context/ContextApi";
import axios from "axios";

const Library = () => {
  // setting the state variables
  const navigate = useNavigate();
  const { setFileIndex, files, roughFiles, setRoughFiles, setFiles } =
    useContext(GlobalContext);
  const [toggleEllisp, setToggleEllips] = useState(true);
  const [Upload, setUpload] = useState(false);
  const [angleUp, setAngleUp] = useState(true);
  const [remove, setRemove] = useState(false);
  const [medFiles, setMedFiles] = useState([]);
  const [consFiles, setConsFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [btnClick, setBtnClick] = useState("all");
  const [catClick, setCatClick] = useState("medic");

  const [user, setUser] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [recentfiles, setRecentfiles] = useState([]);
  const [access, setAccess] = useState([]);

  // the functions here
  const handleEllipsesClick = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  const handleAccess = async (_id) => {
    const url =
      "http://localhost:3000/knust.students/wellnesshub/tasks/library/resources/access";
    try {
      await axios.post(url, { _id }, { withCredentials: true });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavorites = async (_id) => {
    const url =
      "http://localhost:3000/knust.students/wellnesshub/tasks/library/resources/favorites";
    try {
      await axios.post(url, { _id }, { withCredentials: true });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccessRemove = async (resourceId) => {
    const url =
      "http://localhost:3000/knust.students/wellnesshub/tasks/library/access/remove";
    try {
      const result = await axios.post(
        url,
        { resourceId },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredFiles = roughFiles?.filter((file) =>
    file.title.toLowerCase().includes(searchQuery)
  );

  // like function here
  const handleLike = async (_id) => {
    const url =
      "http://localhost:3000/knust.students/wellnesshub/tasks/library/resources/likes";

    try {
      await axios.post(url, { _id }, { withCredentials: true });
    } catch (error) {
      console.log(error);
    }
    location.reload();
  };

  const handleRemove = () => {
    if (!remove) {
      setRecentfiles([]);
    }
    setRemove(!remove);
  };

  const handleAngleUp = () => {
    setAngleUp(!angleUp);
  };

  const handleEllisp = () => {
    setToggleEllips(!toggleEllisp);
  };

  useEffect(() => {
    const handleResizing = () => {
      if (window.innerWidth > 767) {
        setToggleEllips(true);
      }
    };

    window.addEventListener("resize", handleResizing);

    return () => {
      window.removeEventListener("resize", handleResizing);
    };
  }, []);

  useEffect(() => {
    const getLibraryResources = async () => {
      const result = await axios.get(
        "http://localhost:3000/knust.students/wellnesshub/tasks/library/resources",
        { withCredentials: true }
      );

      setFiles([...files, result.data.files]);
      setAccess([...access, result.data.recentAccessed]);
      setMedFiles([...medFiles, result.data.medic]);
      setConsFiles([...consFiles, result.data.cons]);
    };

    const fetchDetails = async () => {
      try {
        const result = await axios.get(
          "http://localhost:3000/knust.students/wellnesshub/tasks/userdetails",
          { withCredentials: true }
        );

        setUser(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDetails();
    getLibraryResources();
  }, []);

  useEffect(() => {
    const getLibraryResources = async () => {
      const result = await axios.get(
        "http://localhost:3000/knust.students/wellnesshub/tasks/library/resources",
        { withCredentials: true }
      );
      setFiles([...files, result.data.recentUpdates]);
    };

    if (catClick === "recent") {
      getLibraryResources();
    }
  }, [catClick]);

  useEffect(() => {
    setRoughFiles(files[0]);
    setRecentfiles(access[0]);

    localStorage.setItem("LibraryFiles", JSON.stringify(roughFiles));
  }, [files]);

  useEffect(() => {
    if (btnClick === "counsellor") {
      setRoughFiles(consFiles[0]);
    }

    if (btnClick === "medic") {
      setRoughFiles(medFiles[0]);
    }

    if (btnClick === "all") {
      setRoughFiles(files[0]);
    }

    localStorage.setItem("LibraryFiles", JSON.stringify(roughFiles));
  }, [btnClick, files]);

  useEffect(() => {
    const savedFiles = localStorage.getItem("LibraryFiles");

    if (savedFiles) {
      setRoughFiles(JSON.parse(savedFiles));
    }
  }, [setRoughFiles]);

  return (
    <div className='main-library'>
      <div className='main-lib-container'>
        <div className='library-menu'>
          <div className='library-menu-1-container'>
            <div className='library-side-logo'>
              <div>
                <img src={logo} alt='' style={{ width: "50px" }} />
              </div>
              <p className='library-title'>Resource Library</p>
            </div>

            <div className='ellispv-bar' onClick={handleEllisp}>
              <FaEllipsisV
                size={15}
                style={{ marginLeft: "100px", color: "grey" }}
              />
              {!toggleEllisp && (
                <>
                  <div className='lib-side-prof'>
                    <Person
                      img={
                        user?.img
                          ? `http://localhost:3000/profImages/${user.img}`
                          : prof
                      }
                    />
                    <p className='lib-side-username'>{user.username}</p>
                  </div>

                  <button
                    className='resource-backBtn'
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigate("/home");
                    }}
                  >
                    &larr; Back To Home Page
                  </button>
                </>
              )}
            </div>
            <div className={toggleEllisp ? "library-menu-1" : "unset"}>
              <div className='library-search-input'>
                <FaSearch className='lib-search-btn' />
                <input
                  type='text'
                  placeholder='Search resources'
                  onChange={handleSearchChange}
                />
              </div>
              <>
                <div className='lib-combined'>
                  <div className='lib-side-prof'>
                    <div className='shift'>
                      <Person
                        img={
                          user?.img
                            ? `http://localhost:3000/profImages/${user.img}`
                            : prof
                        }
                      />
                    </div>

                    <p className='lib-side-username'>{user.username}</p>
                  </div>
                  <button
                    className='resource-backBtn'
                    style={{
                      cursor: "pointer",
                      color: "green",
                      background: "transparent",
                      border: "1px solid green",
                      borderRadius: "4px",
                      height: "25px",
                      margin: "5px -30px 0 -30px",
                      paddingInline: "10px",
                    }}
                    onClick={() => {
                      navigate("/home");
                    }}
                  >
                    &larr;Back
                  </button>
                </div>
              </>
            </div>
          </div>

          {!Upload && (
            <div className='library-menu-2'>
              <button
                className={
                  btnClick === "all"
                    ? "library-menu-2-visited"
                    : "library-menu-btn"
                }
                onClick={() => setBtnClick("all")}
              >
                All
              </button>
              <button
                className={
                  btnClick === "medic"
                    ? "library-menu-2-visited"
                    : "library-menu-btn"
                }
                onClick={() => setBtnClick("medic")}
              >
                Medical
              </button>
              <button
                className={
                  btnClick === "counsellor"
                    ? "library-menu-2-visited"
                    : "library-menu-btn"
                }
                onClick={() => setBtnClick("counsellor")}
              >
                Counselling
              </button>
            </div>
          )}
        </div>
      </div>

      {/* main body component starts from here */}
      {!Upload ? (
        <div className='library-body'>
          <div className='body-first-section'>
            <div
              className='library-search-input-2'
              style={{ alignSelf: "center" }}
            >
              <FaSearch className='lib-search-btn-2' />
              <input
                type='text'
                placeholder='Search resources'
                onChange={handleSearchChange}
              />
            </div>

            <div className='spaced-visited'>
              <FaCheck color='grey' />
              <p>Check these out</p>
            </div>
          </div>

          {/* main body section in the right side division */}

          <div className='body-second-section'>
            <div className='top-box'>
              <div className='top-box-header'>
                <div className='top-box-left-side'>
                  <FaBookReader color='grey' />
                  {remove ? (
                    <div className='top-box-p-txt'>
                      <p className='recent-txt'>No resource accessed yet</p>
                      <p className='recent-txt-small'>
                        Scroll down to view resources available
                      </p>
                    </div>
                  ) : (
                    <div className='top-box-p-txt'>
                      <p className='recent-txt'>
                        List of resources accessed over the last 30 days.
                      </p>
                      <p className='recent-txt-small'>
                        Click the bin button to remove from list
                      </p>
                    </div>
                  )}
                </div>
                <div className='top-box-right-side'>
                  <div className='top-box-right-side-btn'>
                    {!remove && (
                      <button
                        className='recent-file-btn'
                        onClick={handleRemove}
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  {angleUp ? (
                    <FaAngleUp
                      onClick={() => handleAngleUp()}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <FaAngleDown
                      onClick={() => handleAngleUp()}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </div>
              </div>
              <div className='top-box-main'>
                {recentfiles?.map(
                  ({ title, timeStamp, date, time, resourceId }, index) => {
                    return (
                      <div className='recent-file' key={index}>
                        <div className='recent-file-txt'>
                          <p className='recent-file-title'>{title}</p>
                          <p className='timeStamp'>{time}</p>
                        </div>

                        <div className='bin'>
                          <FaTrash
                            size={15}
                            style={{ cursor: "pointer" }}
                            className='bin-btn'
                            onClick={() => handleAccessRemove(resourceId)}
                          />

                          <p className='timeStamp'>{date}</p>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* second main body contents */}

            <div className='bottom-box'>
              {filteredFiles?.length > 0 ? (
                filteredFiles?.map(
                  (
                    {
                      pdf,
                      title,
                      img,
                      prof,
                      author,
                      vid,
                      _id,
                      likes,
                      commentsCount,
                    },
                    index
                  ) => {
                    return (
                      <div key={index} className='file-component'>
                        <div
                          className='file-img'
                          onClick={() => {
                            setFileIndex(index);
                            localStorage.setItem("file-index", index);
                            navigate("/singleResource");
                          }}
                        >
                          {vid ? (
                            <Video
                              loop
                              poster=''
                              style={{ width: "100%", height: "250px" }}
                            >
                              <source
                                src={`http://localhost:3000/videoFiles/${vid}`}
                                type='video/webm'
                              />
                            </Video>
                          ) : (
                            <div>
                              {img ? (
                                <img
                                  src={`http://localhost:3000/imageFiles/${img}`}
                                  alt=''
                                />
                              ) : (
                                <>
                                  {pdf ? (
                                    <div>
                                      <img
                                        src={pdfIcon}
                                        alt=''
                                        width={100}
                                        style={{ borderRadius: "10px" }}
                                      />
                                      <p>{roughFiles?.pdfOriginalName}</p>
                                    </div>
                                  ) : (
                                    <img src={libraryDefault} alt='' />
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        <div className='file-txt'>
                          <Person
                            img={`http://localhost:3000/profImages/${prof}`}
                          />
                          <div
                            className='resource-side-info'
                            onClick={() => {
                              navigate("/singleResource");
                            }}
                          >
                            <p
                              className='file-txt-title'
                              style={{ cursor: "pointer" }}
                            >
                              {title}
                            </p>
                            <p
                              className='file-txt-author'
                              style={{ cursor: "pointer" }}
                            >
                              {author}
                            </p>
                          </div>
                        </div>
                        <div className='comment-like'>
                          <div className='like'>
                            <FaThumbsUp
                              color='grey'
                              style={{ cursor: "pointer" }}
                              onClick={() => handleLike(_id)}
                            />
                            <p className='like'>
                              {likes === 1 ? `${likes} like` : `${likes} likes`}
                            </p>
                          </div>
                          <div className='like'>
                            <FaCommentAlt
                              color='grey'
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                navigate("/singleResource");
                              }}
                            />
                            <p className='like'>
                              {commentsCount === 1
                                ? `${commentsCount} comment`
                                : `${commentsCount} comments`}
                            </p>
                          </div>
                          <div
                            className='faEllips-box'
                            onClick={() => handleEllipsesClick(index)}
                          >
                            <FaEllipsisV
                              color='grey'
                              style={{ cursor: "pointer" }}
                            />

                            <div
                              className={`fa-hide ${
                                activeId === index ? "show" : ""
                              }`}
                            >
                              <p
                                style={{ cursor: "pointer" }}
                                onClick={() => handleAccess(_id)}
                              >
                                access
                              </p>
                              <p
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  handleFavorites(_id);
                                }}
                              >
                                add to favorites
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )
              ) : (
                <p>No files found</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default Library;
