import { FaTimes } from "react-icons/fa";
import prof3 from "../assets/phil.jpg";
import "./DisplayImage.css";

const DisplayImage = ({ img }) => {
  return (
    <div className='image-class'>
      <FaTimes />
      <img style={{ width: "100%", objectFit: "cover" }} src={prof3} alt='' />
    </div>
  );
};
export default DisplayImage;
