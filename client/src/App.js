import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SetAvatar from './components/SetAvatar';
import Register from './pages/Register';
import Login from './pages/Login';
import Chat from './pages/Chat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
