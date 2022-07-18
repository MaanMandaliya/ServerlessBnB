import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';

import { BrowserRouter, Route, Routes } from "react-router-dom";


import { Link, Navigate } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import MessagePassing from './pubsub/MessagePassing';
// import NotificationHistory from './Message Passing/NotificationHistory';



function App() {
 
  return (
    <div className="App">
   
        <BrowserRouter>
          <Routes>
            <Route path="/notifications" element={<MessagePassing />} />
            
          </Routes>
        </BrowserRouter>

       

    </div>
  );
}

export default App;
