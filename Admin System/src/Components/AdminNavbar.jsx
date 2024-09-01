import { FaBell, FaBars } from "react-icons/fa";
import logo from "../assets/logo.jpg";
import "./AdminNavbar.css";
import { Badge } from "antd";
import { useNavigate } from "react-router-dom";

function AdminNavbar({
  isOpen,
  toggle,
  userName,
  role,
  numOfUnSeenNotification,
}) {
  const navigate = useNavigate();
  return (
    <nav className="admin-nav">
      <div className="sidebar_top_section">
        <img
          src={logo}
          alt=""
          style={{ display: isOpen ? "block" : "none" }}
          className="sidebar_logo"
        />
        <div
          style={{ marginLeft: isOpen ? "50px" : "0px" }}
          className="sidebar_bars "
        >
          <FaBars onClick={toggle} className="bars-icon" />
        </div>
        <img src={logo} alt="logo" className="navbar-logo" />
      </div>
      <h3>uniCare Admin Panel</h3>
      <div className="nav-icons">
        {role !== "admin" && (
          <>
            <span onClick={() => navigate("/panel/notification")}>
              <Badge count={numOfUnSeenNotification}>
                <FaBell className="nav-i" />
              </Badge>
            </span>
          </>
        )}
        <span className="user-details-container">
          <span>{userName}</span>
          <span className="user-role">{role}</span>
        </span>
      </div>
    </nav>
  );
}

export default AdminNavbar;
