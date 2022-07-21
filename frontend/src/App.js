import "./App.css";
import Header from "./Custom-Components/Header/header";
import Login from "./Custom-Components/Login/Login";
import Questionnare from "./Custom-Components/Login/Questionnaire";
import CaesarCipher from "./Custom-Components/Login/CaesarCipher";
import Dashboard from "./Custom-Components/Dashboard/dashboard";
import Registration from "./Custom-Components/Register/Register";
import User from "./Custom-Components/Reports/user";
import Food from "./Custom-Components/Reports/food";
import Booking from "./Custom-Components/Reports/booking";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/questionnare" element={<Questionnare />} />
          <Route path="/caesarcipher" element={<CaesarCipher />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/user-report" element={<User />}></Route>
          <Route path="/food-report" element={<Food />} />
          <Route path="/booking-report" element={<Booking />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
