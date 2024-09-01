import React, { useContext, useEffect, useState } from "react";

import "./ChatNavBar.css";
import logo from "../assets/logo.jpg";
import prof from "../assets/defaultProf.jpg";
import {
  FaAddressCard,
  FaArrowLeft,
  FaBars,
  FaEllipsisV,
  FaSearch,
} from "react-icons/fa";
import Person from "./Profile";
import { NavLink } from "react-router-dom";
import { GlobalContext } from "../Context/ContextApi";
import axios from "axios";

const Sidebar = () => {
  const { chat, setChat, sized, setDisplayUserInfo, setTimesClicked } =
    useContext(GlobalContext);
  const [user, setUser] = useState([]);

  const [toggleEllisp, setToggleEllisp] = useState(false);

  // function to toggle the ellisp button
  const handleEllisp = () => {
    setToggleEllisp(!toggleEllisp);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767) {
        setToggleEllisp(false);
      }
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
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className='main-sidebar'>
      <div className='main-chat-container'>
        <div className='chat-menu'>
          <div className='library-side-logo'>
            <div>
              <img src={logo} alt='' style={{ width: "50px" }} />
            </div>
            <p className='library-title'>Chat</p>
          </div>

          <div className='ellispv-bar'>
            <FaEllipsisV
              onClick={handleEllisp}
              style={{ marginLeft: "90px" }}
            />
          </div>
          <div className={!toggleEllisp ? "library-menu-1" : " chat-log"}>
            <div className='library-search-input '>
              <FaSearch className='lib-search-btn' />
              <input type='text' placeholder='Search previous chat texts' />
            </div>

            <div className='prof-logout'>
              {sized && (
                <FaAddressCard
                  color='green'
                  size={40}
                  cursor='pointer'
                  onClick={() => {
                    setTimesClicked((prev) => !prev);
                  }}
                />
              )}

              <div className='lib-side-prof'>
                <Person
                  img={
                    user?.img
                      ? `http://localhost:3000/profImages/${user.img}`
                      : prof
                  }
                />
                <p className='lib-side-username'>{user?.username}</p>
              </div>
              {sized && (
                <>
                  {chat && (
                    <div
                      style={{
                        marginTop: "5px",
                        color: "white",
                        padding: "5px",
                        borderRadius: "5px",
                        background: "green",
                        height: "30px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setDisplayUserInfo((prev) => !prev);
                      }}
                    >
                      Bio Data
                    </div>
                  )}
                </>
              )}
              <div className='logout'>
                <button
                  className='logout-btn'
                  onClick={() => {
                    setChat(null);
                    localStorage.removeItem("selectedChat");
                    localStorage.removeItem("selectedChatDetails");
                  }}
                >
                  <NavLink
                    to='/home'
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    <FaArrowLeft style={{ paddingTop: "5px" }} />
                    <span style={{ color: "white", textDecoration: "none" }}>
                      Back Home
                    </span>
                  </NavLink>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
