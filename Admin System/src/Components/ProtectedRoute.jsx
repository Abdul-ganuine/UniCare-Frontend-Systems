import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/userSlice";
import { hideLoading, showLoading } from "../redux/alertSlice";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const dispath = useDispatch();
  const { user, reloadUser } = useSelector((state) => state.user);

  const getUser = async () => {
    try {
      dispath(showLoading());
      const response = await axios.post(
        "http://localhost:3000/api/auth/getDataByID",
        { userId: localStorage.getItem("userId") },
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        dispath(setUser(response.data.data));
        dispath(hideLoading());
      } else {
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      localStorage.clear();
      dispath(hideLoading());
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!user || reloadUser) {
      getUser();
    }
  }, [user]);

  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      navigate("/login");
    }
  }, [navigate]);

  if (localStorage.getItem("userId")) {
    return <div>{children}</div>;
  }

  return null;
}

export default ProtectedRoute;
