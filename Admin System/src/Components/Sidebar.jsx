import {
  FaHandsHelping,
  FaUser,
  FaTh,
  FaWpforms,
  FaCalendarAlt,
  FaComments,
  FaFileAlt,
  FaSignOutAlt,
  FaLock,
  FaUserMd,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./Sidebar.css";
import { clearUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function Sidebar({ isOpen, role }) {
  const dispath = useDispatch();
  const navigate = useNavigate();
  function handleLogOut() {
    dispath(clearUser());
    localStorage.clear();
    navigate("/login");
  }
  const adminMenuItem = [
    {
      path: "dashboard",
      name: "Dashboard",
      icon: <FaTh />,
    },
    {
      path: "doctor",
      name: "Doctors",
      icon: <FaUserMd />,
    },
    {
      path: "counsellor",
      name: "Counsellor",
      icon: <FaHandsHelping />,
    },
    {
      path: "form",
      name: "Add Personnel",
      icon: <FaWpforms />,
    },
  ];
  const healthProfessionalMenuItem = [
    {
      path: "dashboard",
      name: "Dashboard",
      icon: <FaTh />,
    },
    {
      path: "appointment",
      name: "Appointment",
      icon: <FaCalendarAlt />,
    },
    {
      path: "uploadResource",
      name: "Resource",
      icon: <FaFileAlt />,
    },
    {
      path: "chat",
      name: "Chat",
      icon: <FaComments />,
    },
    {
      path: "profile",
      name: "Profile",
      icon: <FaUser />,
    },
    {
      path: "reset-password",
      name: "Reset Password",
      icon: <FaLock />,
    },
  ];
  const menuItemsToDisplay =
    role === "admin" ? adminMenuItem : healthProfessionalMenuItem;
  return (
    <div className="container">
      <div style={{ width: isOpen ? "200px" : "50px" }} className="sidebar">
        {menuItemsToDisplay.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className={({ isActive }) =>
              "sidebar_link" + (isActive ? " active" : "")
            }
          >
            <div className="icon">{item.icon}</div>
            <div
              style={{ display: isOpen ? "block" : "none" }}
              className="sidebar_link_text"
            >
              {item.name}
            </div>
          </NavLink>
        ))}
        <div
          className="sidebar_link"
          onClick={() => {
            handleLogOut();
          }}
        >
          <div className="icon">
            <FaSignOutAlt />
          </div>
          <div
            style={{ display: isOpen ? "block" : "none" }}
            className="sidebar_link_text"
          >
            Logout
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
