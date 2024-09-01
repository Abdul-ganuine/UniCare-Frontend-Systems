import React from "react";
export function UsersLodge({ index, sized, img, username, message, time }) {
  return (
    <div className='users-lodge'>
      {users.map(({ username, img, time, message }, index) => (
        <div className='users' key={index}>
          <Link
            to={sized ? "/chatroom" : "/messageroomsub"}
            style={{
              textDecoration: "none",
            }}
            className='users-link'
          >
            <div className='single-user'>
              <Person img={img} />
              <div className='msg-txt-time'>
                <div className='person-txt-info'>
                  <p className='msg-username'>{username}</p>
                  <p className='msg'>{message}</p>
                </div>
                <p className='time'>{time}</p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
