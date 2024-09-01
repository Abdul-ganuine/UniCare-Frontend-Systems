import "./Chatlist.css";
import person from "../assets/prof6.jpeg";
import person2 from "../assets/prof7.jpeg";
function Chatlist() {
  return (
    <div className="chatlist">
      <div className="chatlist-search-bar">
        <input
          type="search"
          className="chatlist-search"
          placeholder="Search🔍"
        />
      </div>
      <div className="userItem">
        <img src={person} alt="" />
        <div className="userText">
          <span>King James</span>
          <p>Hello</p>
        </div>
      </div>
      <div className="userItem">
        <img src={person2} alt="" />
        <div className="userText">
          <span>Anthony Davis</span>
          <p>Hello</p>
        </div>
      </div>
    </div>
  );
}

export default Chatlist;
