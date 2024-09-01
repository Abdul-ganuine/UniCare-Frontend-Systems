import { useSelector } from "react-redux";
import "./Notification.css";
import axios from "axios";
import { Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertSlice";
import { setUser } from "../redux/userSlice";

function Notification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const markAllAsSeen = async () => {
    dispatch(showLoading());
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/mark-all-notifications-as-seen",
        { id: user.id },
        {
          withCredentials:true,
        }
      );
      dispatch(hideLoading());
      if (res.data.status) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.dataS));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      dispatch(hideLoading());
    }
  };

  const deleteAllNotifications = async () => {
    dispatch(showLoading());
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/delete-all-notifications",
        { id: user.id },
        {
          withCredentials:true,
        }
      );
      dispatch(hideLoading());
      if (res.data.status) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.dataS));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      dispatch(hideLoading());
    }
  };

  const items = [
    {
      key: "1",
      label: "Unseen",
      children: (
        <div className="mark-container">
          <div className="mark">
            <p onClick={() => markAllAsSeen()}>Mark all as seen</p>
          </div>
          <div className="notifications-box">
            {user?.unSeenNotifications.map((notification, i) => (
              <p key={i} className="notification">
                {notification.message}
              </p>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Seen",
      children: (
        <div className="mark-container">
          <div className="mark">
            <p onClick={() => deleteAllNotifications()}>Delete all</p>
          </div>
          <div className="notifications-box">
            {user?.seenNotifications.map((notification, i) => (
              <div
                className="message"
                key={i}
                onClick={() => navigate(notification.onClickPath)}
              >
                <p className="notification">{notification.message}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="notification-container">
      <h3>Notifications</h3>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}

export default Notification;
