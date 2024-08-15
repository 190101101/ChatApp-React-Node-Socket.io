import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { allUsersRoute, host } from '../utils/APIRoutes';
import { REACT_APP_LOCALHOST_KEY } from '../utils/define';
import Welcome from '../components/Welcome';
import Contacts from '../components/Contacts';
import ChatContainer from '../components/ChatContainer';

export default function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const getUserFromStorage = async () => {
      if (!localStorage.getItem(REACT_APP_LOCALHOST_KEY)) {
        return navigate('/login');
      } else {
        setCurrentUser(
          await JSON.parse(localStorage.getItem(REACT_APP_LOCALHOST_KEY))
        );
        setIsLoaded(true);
      }
    };
    getUserFromStorage();
  }, []);

  useEffect(() => {
    const isNoSettledAvatar = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const { data } = await axios.get(
            `${allUsersRoute}/${currentUser._id}`
          );
          setContacts(data);
        } else {
          navigate('/setAvatar');
        }
      }
    };

    isNoSettledAvatar();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit('add-user', currentUser._id);
    }
  });

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Container>
        <div className="container">
          {isLoaded && (
            <Contacts contacts={contacts} changeChat={handleChatChange} />
          )}
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
