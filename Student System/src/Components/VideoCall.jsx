import NavBar from "../Components/ChatNavBar";
import { DefaultPlayer as Video } from "react-html5video";
import "react-html5video/dist/styles.css";
import "./videocall.css";
import depressed from "../assets/depressed.mp4";
import docMedic from "../assets/docMedic.mp4";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhone,
  FaVideo,
  FaVideoSlash,
  FaVolumeUp,
} from "react-icons/fa";
import { useState } from "react";

const VideoCall = () => {
  const [mute, setMute] = useState(false);
  const [videoMute, setVideoMute] = useState(false);
  const [answered, setAnswered] = useState(true);
  const [speakerOUt, setSpeakerOUt] = useState(false);
  const [switScreen, setSwitchScreen] = useState(false);

  const handleMute = () => {
    setMute(!mute);
  };

  const handleScreen = () => {
    setVideoMute(!videoMute);
  };

  const handleSwitchScreen = () => [setSwitchScreen(!switScreen)];

  const handleSpeakerOut = () => {
    setSpeakerOUt(!speakerOUt);
  };

  return (
    <div>
      <div className='nav'>
        <NavBar />
      </div>

      <div className='fixed-videoContainer'>
        {" "}
        <div className='video-section'>
          <div
            className={switScreen ? "other" : "me"}
            onClick={handleSwitchScreen}
          >
            <Video loop poster='' style={{ width: "100%", height: "100%" }}>
              <source src={depressed} type='video/webm' />
            </Video>
          </div>
          <div
            className={switScreen ? "me" : "other"}
            onClick={handleSwitchScreen}
          >
            <Video loop poster='' style={{ width: "100%", height: "100%" }}>
              <source src={docMedic} type='video/webm' />
            </Video>
          </div>

          <div className='call-buttons'>
            <div
              className={speakerOUt ? "white" : " circle"}
              onClick={handleSpeakerOut}
            >
              <FaVolumeUp size={25} color={speakerOUt ? "black" : "white"} />
            </div>

            <div
              className={videoMute ? "white" : "circle"}
              onClick={handleScreen}
            >
              {videoMute ? (
                <FaVideoSlash size={25} color='black' />
              ) : (
                <FaVideo size={25} color='white' />
              )}
            </div>
            <div className={mute ? "white" : "circle"} onClick={handleMute}>
              {mute ? (
                <FaMicrophoneSlash size={25} color='black' />
              ) : (
                <FaMicrophone size={25} color='white' />
              )}
            </div>
            <div className={answered ? "reject" : " green-button"}>
              <FaPhone size={25} color={answered ? "black" : "white"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VideoCall;
