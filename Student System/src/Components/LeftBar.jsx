import React, { useCallback, useContext, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import Person from "./Profile";
import "./leftbar.css";
import prof from "../assets/defaultProf.jpg";
import { GlobalContext } from "../Context/ContextApi";
import axios from "axios";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:3000";
let socket;

// Debounce function definition
const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
};

const Sidebar = () => {
  const { chat, setChat } = useContext(GlobalContext);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { sized, handleResizing } = useContext(GlobalContext);

  useEffect(() => {
    handleResizing();
    window.addEventListener("resize", handleResizing);

    return () => {
      window.removeEventListener("resize", handleResizing);
    };
  }, [handleResizing]);

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

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleChatSelect = async (id) => {
    const url = "http://localhost:3000/knust.students/wellnesshub/chats";
    try {
      const result = await axios.post(
        url,
        { userId: id },
        {
          withCredentials: true,
        }
      );
      setChat(result.data);
      localStorage.setItem("selectedChat", JSON.stringify(result.data));
    } catch (error) {
      console.log(error);
    }
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
    if (chat && chat._id) {
      socket.emit("join chat", chat._id);
    }
  }, [chat]);

  return (
    <div>
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
              key={index}
              onClick={() => handleChatSelect(_id)}
            >
              <Link
                to={!sized ? "/chatroom" : "/messageroomsub"}
                style={{ textDecoration: "none" }}
                className='users-link'
              >
                <div className='single-user'>
                  <Person
                    img={img ? `http://localhost:3000/profImages/${img}` : prof}
                  />
                  <div className='msg-txt-time'>
                    <div className='person-txt-info'>
                      <p className='msg-username'>{username}</p>
                      <p className='msg'>{message}</p>
                    </div>
                    <p className='time'>{time}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
