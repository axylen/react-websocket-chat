import React, { useState, useEffect } from 'react';
import Login from './Components/Login/Login';
import Chat from './Containers/Chat/Chat';

import openSocket from 'socket.io-client';

const SocketContext = React.createContext(null);

function App() {
  const [user, setUser] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [socket, setSocket] = useState(null);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const conectionAddress =
      process.env.NODE_ENV === 'development' ? '//:8080' : undefined;
    const socket = openSocket(conectionAddress);
    setSocket(socket);

    socket.on('user:updatecount', setUserCount);

    return socket.close;
  }, []);

  function handleLogin() {
    setLoggedIn(true);

    setUser(user.trim());

    socket.emit('user:connect', { user: user.trim() });
  }
  function handleLogout() {
    setLoggedIn(false);

    socket.emit('user:disconnect');
  }

  return loggedIn ? (
    <SocketContext.Provider value={socket}>
      <Chat user={user} logout={handleLogout} userCount={userCount} />
    </SocketContext.Provider>
  ) : (
    <Login
      user={user}
      setUser={setUser}
      login={handleLogin}
      userCount={userCount}
    />
  );
}

export default App;
export { SocketContext };
