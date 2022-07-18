import logo from './logo.svg';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import Header from './Components/Header/header';
import Login from './Components/Login/Login';
import Questionnare from './Components/Login/Questionnaire';
import CaesarCipher from './Components/Login/CaesarCipher';
import Dashboard from './Components/Dashboard/dashboard';
import Registration from './Components/Register/Register';


function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/questionnare" element={<Questionnare/>} />
        <Route path="/caesarcipher" element={<CaesarCipher/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/registration" element={<Registration/>} />
      </Routes>
    </BrowserRouter>
      
    </div>
  );
}

export default App;
