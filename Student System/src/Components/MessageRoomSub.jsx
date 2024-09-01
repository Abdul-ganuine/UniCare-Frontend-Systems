import NavBar from "../Components/ChatNavBar";
import MessageRoom from "./MessageRoom";
const MessageRoomSub = () => {
  return (
    <div>
      <NavBar />
      {/* <div className='chat-main'> */}
      <div className='chat-body'>
        <div className='main-messageroom-sub' style={{ width: "125%" }}>
          <div className='message-room' style={{ width: "100%" }}>
            <MessageRoom />
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};
export default MessageRoomSub;
