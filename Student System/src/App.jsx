import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Library from "./Pages/Library";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chatroom from "./Pages/Chatroom";
import MessageRoomSub from "./Components/MessageRoomSub";
import ProfileManagement from "./Pages/profileManagement";
import AppointmentBooking from "./Pages/AppointmentBooking";
import SingleResource from "./Pages/SingleResource";
import ProtectedRoute from "./Context/ProtectedRoute";
import DisplayImage from "./Pages/DisplayImage";
import VideoCall from "./Components/VideoCall";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path='/home' element={<Home />} />
            <Route path='/library' element={<Library />} />
            <Route path='/chatroom' element={<Chatroom />} />
            <Route path='/messageroomsub' element={<MessageRoomSub />} />
            <Route path='/profileManagement' element={<ProfileManagement />} />
            <Route path='/videoCall' element={<VideoCall />} />
            <Route path='/fullimage' element={<DisplayImage />} />
            <Route
              path='appointmentScheduling'
              element={<AppointmentBooking />}
            />
            <Route path='singleResource' element={<SingleResource />} />
          </Route>
          <Route path='/' element={<Register />} />
        </Routes>
      </Router>

      <ToastContainer />
    </div>
  );
};
export default App;
