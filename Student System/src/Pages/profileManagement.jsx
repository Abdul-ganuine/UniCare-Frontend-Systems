import { useContext } from "react";
import Updateinfo from "../Components/updateInfo";
import UploadImage from "../Components/uploadImage";

import "./profileManagement.css";
import { GlobalContext } from "../Context/ContextApi";

function ProfileManagement() {
  const { updateProfile, setUpdateProfile } = useContext(GlobalContext);
  return (
    <main className='profile'>
      <div className='profilePageContainer'>
        {/* <UploadImage /> */}
        <Updateinfo />
      </div>
    </main>
  );
}

export default ProfileManagement;
