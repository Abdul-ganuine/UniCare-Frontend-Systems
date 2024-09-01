import Counsellors from "./Components/Counsellors";
import Dashboard from "./Components/Dashboard";
import Doctors from "./Components/Doctors";
import ViewAppointments from "./Components/ViewAppointments";
import Chat from "./Components/Chat";
import Adminpanel from "./Pages/Adminpanel";
import Login from "./Pages/Login";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ForgotPassword from "./Components/ForgotPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { useSelector } from "react-redux";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";
import Notification from "./Components/Notification";
import ChangePassword from "./Components/ChangePassword";
import EditModal from "./Components/EditModal";
import Modal from "./Components/Modal";
import UploadResource from "./Components/UploadResource";

function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <div>
      <BrowserRouter>
        {loading && (
          <div className="loader-container">
            <span className="loader"></span>
          </div>
        )}
        <Routes>
          <Route index element={<Navigate replace to="/login" />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/panel"
            element={
              <ProtectedRoute>
                <Adminpanel />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="doctor" element={<Doctors />}></Route>
            <Route path="counsellor" element={<Counsellors />}></Route>
            <Route path="form" element={<Modal />} />
            <Route path="appointment" element={<ViewAppointments />} />
            <Route path="chat" element={<Chat />} />
            <Route path="profile" element={<EditModal />} />
            <Route path="uploadResource" element={<UploadResource />} />
            <Route path="notification" element={<Notification />} />
            <Route path="reset-password" element={<ChangePassword />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer autoClose={1500} pauseOnHover={false} />
    </div>
  );
}

export default App;
