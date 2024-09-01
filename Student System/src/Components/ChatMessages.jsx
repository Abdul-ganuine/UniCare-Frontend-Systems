import React, { useContext, useEffect, useRef } from "react";
import "./ChatMessages.css";
import SingleChat from "./SingleChat";
import { GlobalContext } from "../Context/ContextApi";

// Group messages by date
const groupMessagesByDate = (messages) => {
  return messages.reduce((acc, message) => {
    const messageDate = new Date(message.timestamp).toLocaleDateString();

    if (!acc[messageDate]) {
      acc[messageDate] = [];
    }

    acc[messageDate].push(message);
    return acc;
  }, {});
};

// Format dates
const formatDate = (date) => {
  const today = new Date();
  const messageDate = new Date(date);

  const isToday = messageDate.toDateString() === today.toDateString();
  const isYesterday =
    messageDate.toDateString() ===
    new Date(today.setDate(today.getDate() - 1)).toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";
  return messageDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ChatMessages = ({ chatMessage }) => {
  const { currentUser } = useContext(GlobalContext);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessage]);

  const groupedMessages = groupMessagesByDate(chatMessage);

  return (
    <div className='di-messages'>
      {Object.keys(groupedMessages).map((date, index) => (
        <div key={index}>
          <div className='date-header'>{formatDate(date)}</div>
          {groupedMessages[date].map((itms, idx) => (
            <div className='di-messages'>
              <div
                className={
                  itms.sender._id === currentUser._id ? "sender" : "receiver"
                }
                key={idx}
              >
                <SingleChat {...itms} />
              </div>
            </div>
          ))}
        </div>
      ))}
      {/* <div ref={messagesEndRef} /> */}
    </div>
  );
};

export default ChatMessages;
