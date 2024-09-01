import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../Components/AdminNavbar";
import Sidebar from "../Components/Sidebar";
import "./Adminpanel.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { RoleProvider } from "../Context/RoleProvider.jsx";

function Adminpanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const [numOfUnSeenNotification, setNumOfUnseenNotification] = useState(null);
  const { user } = useSelector((state) => state.user);
  const userId = localStorage.getItem("userId");

  const toggle = () => setIsOpen(!isOpen);

  const getData = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/getDataByID",
        {userId},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user && user.role) {
      setRole(user.role);
      setUserName(user.name);
      setNumOfUnseenNotification(user.unSeenNotifications.length);
    }
  }, [user]);

  useEffect(() => {
    getData();
  }, []);
  return (
    <main className='panel'>
      <AdminNavbar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        toggle={toggle}
        userName={userName}
        role={role}
        numOfUnSeenNotification={numOfUnSeenNotification}
      />
      <div className='panel-container'>
        <Sidebar isOpen={isOpen} role={role} />
        <RoleProvider role={role}>
          <Outlet />
        </RoleProvider>
      </div>
    </main>
  );
}

export default Adminpanel;
