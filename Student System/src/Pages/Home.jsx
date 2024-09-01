import {
  FaSearch,
  FaBell,
  FaTimes,
  FaBars,
  FaCalendar,
  FaBookOpen,
  FaHome,
  FaComment,
  FaSignOutAlt,
  FaArrowRight,
  FaStar,
} from "react-icons/fa";
import prof from "../assets/defaultProf.jpg";
import logo from "../assets/logo.jpg";
import counselling from "../assets/counscon.jpg";
import medical from "../assets/blackmed.jpg";
import therapy from "../assets/therapy.jpg";
import medic from "../assets/docMedic.mp4";
import "./home.css";
import { DefaultPlayer as Video } from "react-html5video";
import "react-html5video/dist/styles.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect, useContext, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../Context/ContextApi";
import Person from "../Components/Profile";
import pdfIcon from "../assets/pdf-icon.png";
import libraryDefault from "../assets/libraryDefault.png";

const availableServices = [
  { name: "medical", img: medical, desc: "Live Consultation Scheduling" },
  {
    name: "counselling",
    img: counselling,
    desc: "One-on-One and online Counselling Services",
  },
  {
    name: "Others",
    img: therapy,
    desc: "daily wellness blogs and a resource library",
  },
];

const clientReviews = [
  { username: "bra Dennis", prof: prof, time: "3:40" },
  { username: "Felix Sam", prof: medic, time: "7:53am" },
  { username: "Kuzo Music", prof: therapy, time: "10:04am" },
];

const Home = () => {
  const [toggle, setToggle] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [libResources, setLibResources] = useState([]);

  const { setChat, currentUser, setCurrentUser, profImage, setProfImage } =
    useContext(GlobalContext);
  const navigate = useNavigate();

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const handleLogOut = async () => {
    const url = "http://localhost:3000/knust.students/wellnesshub/auth/logout";
    const response = await axios.post(
      url,
      { _id: currentUser._id },
      { withCredentials: true }
    );

    setCurrentUser(null);
    localStorage.removeItem("currentUser");

    setChat(null);
    localStorage.removeItem("selectedChat");

    navigate("/");
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767) {
        // Desktop viewport
        setToggle(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await axios.get(
          "http://localhost:3000/knust.students/wellnesshub/tasks/userdetails",
          { withCredentials: true }
        );

        setProfImage(result.data.img);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDetails();
  }, []);

  // perform a search query
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Debounce function definition
  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
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
    const fetchLibraryResources = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/knust.students/wellnesshub/tasks/library/resources",
          { withCredentials: true }
        );
        const resources = response.data.files;
        console.log(resources);

        const latestResources = resources.slice(0, 3);

        setLibResources(latestResources);
      } catch (error) {
        console.error("Error fetching library resources:", error);
      }
    };

    fetchLibraryResources();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className='home-page'>
      <div className='menu-updated'>
        <div className='menu-logo'>
          <img src={logo} alt='' />
        </div>
        <div className='menu-list-container'>
          <button
            onClick={handleToggle}
            style={{ border: "none", background: "transparent", color: "grey" }}
            className='toggle-menu'
          >
            {!toggle ? (
              <FaBars size={25} style={{ cursor: "pointer" }} />
            ) : (
              <div className='fa-times'>
                <FaTimes size={25} style={{ cursor: "pointer" }} />
              </div>
            )}
          </button>
          <div className={toggle ? "display" : "menu-list"}>
            <div className='list-items'>
              <NavLink
                to='/home'
                style={{ textDecoration: "none", color: "black" }}
              >
                <div className='items itms-btns home-active'>
                  {toggle && <FaHome size={15} />}
                  home
                </div>
              </NavLink>

              <NavLink
                to='/chatroom'
                style={{ textDecoration: "none", color: "black" }}
              >
                <div className='items itms-btns'>
                  {toggle && <FaComment size={15} />}
                  Chatroom
                </div>
              </NavLink>

              <NavLink
                to='/library'
                style={{ textDecoration: "none", color: "black" }}
              >
                <div className='items itms-btns'>
                  {toggle && <FaBookOpen size={15} />}
                  Resources
                </div>
              </NavLink>

              <NavLink
                to='/appointmentScheduling'
                style={{ textDecoration: "none", color: "black" }}
              >
                <div className='items itms-btns'>
                  {toggle && <FaCalendar size={15} />}
                  Appointments
                </div>
              </NavLink>

              <NavLink
                to='/notification'
                style={{ textDecoration: "none", color: "black" }}
              >
                <di className='items itms-btns '>
                  <FaBell size={15} />

                  {toggle && <span className='itms'> Notification</span>}
                </di>
              </NavLink>
            </div>

            <NavLink
              to='/profileManagement'
              style={{ textDecoration: "none", color: "black" }}
            >
              <div className='profile'>
                <img
                  src={
                    profImage
                      ? `http://localhost:3000/profImages/${profImage}`
                      : prof
                  }
                  alt=''
                />
              </div>
            </NavLink>

            <div className='items itms-btns' onClick={handleLogOut}>
              <FaSignOutAlt size={20} />
            </div>
          </div>
        </div>
      </div>
      <div className='main-page'>
        <div className='main-page-sub'>
          <div className='heading-txt'>
            <h2>Find a wellness Professional</h2>
          </div>

          <div className='search-bar'>
            <div className='search-input-bar'>
              <input
                type='text'
                name='search'
                id=''
                placeholder='Search for a doctor,a counsellor,or others'
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              <div className='search-icon'>
                <FaSearch size={15} color='grey' />
              </div>
            </div>
          </div>

          {searchQuery && users.length > 0 && (
            <div className='search-bar-display'>
              {users.map(({ username, img, _id, specialization }, index) => (
                <div
                  className='users search-users'
                  style={{ cursor: "pointer" }}
                  key={index}
                  onClick={() => {
                    navigate("/Chatroom");
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
                        <p className='msg'>{specialization}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className='intro-txt'>
            <p className='intro-trust'>trust us for your wellness</p>
            <h3 className='intro-bold'>
              Let's get back your <span>physical and mental health </span> with
              our health care professionals
            </h3>
            <p className='intro-lorem'>
              Empower your journey to wellness with our all-in-one app, designed
              to nurture your mind, body, and soul. Discover personalized
              guidance, track your progress, and unlock your full potential,one
              mindful step at a time.
            </p>

            <div className='services-btn'>
              <button
                onClick={() =>
                  document
                    .getElementById("what-we-do")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                Our Services
              </button>
            </div>
          </div>
        </div>

        <div id='what-we-do' className='what-we-do'>
          <div className='what-we-do-txt'>
            <p className='txt-first'>what we do</p>
            <p className='txt-second'>
              we're here to help you. please follow to check the services we
              provide.
            </p>
          </div>

          <ul className='search-list available-ul'>
            {availableServices.map((itms, index) => {
              return (
                <li className='available-list' key={index}>
                  <img src={itms.img} alt='' className='available-img' />
                  <div className='job-titles-list'>
                    <p className='job-titles'>{itms.name}</p>
                    <p className='job-description'>{itms.desc}</p>
                    <div className='learn-more-btn'>
                      <button className='learn-more'>learn more</button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className='about-us'>
            <div className='about-txt'>
              <p className='about-title'>about us</p>
            </div>
            <div className='about-video'>
              <div className='div'>
                <Video autoPlay loop style={{ width: "100%", height: "100%" }}>
                  <source src={medic} type='video/webm' />
                </Video>
              </div>

              <div className='p-txt'>
                <h3 className='about-info '>
                  We combine medical consultations and counseling services for
                  students' physical health, depression and other mental health
                  conditions.
                </h3>

                <p className='about-smaller-info '>
                  Elevating student wellness, our app merges medical
                  consultations and counseling services to effectively tackle
                  comprehensive physical and mental health conditions.
                </p>
                <p className='about-smaller-info '>
                  Locate us at the Knust hospital and our counselling offices
                  accross all the various colleges for in-person medical and
                  counselling consultations respectively, not forgetting our
                  live online sessions at the comfort of your homes
                </p>
              </div>
            </div>
          </div>
          <div className='library-blogs' style={{ width: "100%" }}>
            <p className='library-blogs-title'>resource library</p>
            <div className='library-blogs-header'>
              <p className='library-blogs-title-sub'>
                check our resource library
              </p>
              <div className='lib-button' onClick={() => navigate("/library")}>
                <p>All Resources</p>
                <FaArrowRight />
              </div>
            </div>

            <div className='blogs-file-loop'>
              {libResources.map(
                ({ img, username, title, prof, vid, pdf }, index) => {
                  return (
                    <div className='blogs-file' key={index}>
                      <div
                        className='blogs-file-card'
                        onClick={() => {
                          // setFileIndex(index);
                          // navigate("/singleResource");
                        }}
                      >
                        {vid ? (
                          <Video
                            loop
                            poster=''
                            style={{ width: "100px", height: "250px" }}
                          >
                            <source
                              src={`http://localhost:3000/videoFiles/${vid}`}
                              type='video/webm'
                            />
                          </Video>
                        ) : (
                          <div>
                            img (
                            <img
                              src={`http://localhost:3000/imageFiles/${img}`}
                              alt=''
                              width='100%'
                              height='100%'
                            />
                            )
                          </div>
                        )}
                      </div>
                      <div className='file-txt'>
                        <p
                          className='file-txt-title'
                          style={{
                            cursor: "pointer",
                            textAlign: "center",
                            color: "white",
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                          }}
                        >
                          {title}
                        </p>

                        <div className='blog-post-prof'>
                          <div style={{ marginLeft: "20px" }}>
                            <Person img={prof} />
                          </div>

                          <p
                            className='file-txt-author'
                            style={{
                              cursor: "pointer",
                              color: "white",
                              paddingTop: "10px",
                            }}
                          >
                            {username}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          <div className='client-review'>
            <div className='review-left'>
              <p className='review-title'>clients review</p>
              <h4 className='review-left-heading'>
                discover our client feedback
              </h4>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Corrupti debitis enim atque quae, reiciendis consectetur magni
                officiis vel molestias veniam iusto natus at. Provident maxime
                error, dignissimos repellat
              </p>

              <div className='review-btn'>
                <div>discover all</div>
                <FaArrowRight />
              </div>
            </div>

            <div className='review-right-container'>
              <Slider {...settings}>
                {clientReviews.map(({ username, prof, time }, index) => {
                  return (
                    <div className='review-right' key={index}>
                      <div>
                        <div className='stars'>
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                        </div>

                        <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Dolorem, provident harum unde sed non ea ipsum
                          deserunt nostrum hic amet libero
                        </p>
                        <div className='review-person'>
                          <Person img={prof} />
                          <div className='review-person-name'>
                            <p style={{ fontWeight: "bold" }}>{username}</p>
                            <p style={{ color: "green" }}>{time}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div>
          </div>
          <div className='footer' style={{ width: "100%" }}>
            <p>Kwame Nkrumah University of science and technology &copy;2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
