import "./App.css";
import Header from "./components/header/header";
import Login from "./components/Login/Login";
import Questionnare from "./components/Login/Questionnaire";
import CaesarCipher from "./components/Login/CaesarCipher";
import Dashboard from "./components/Dashboard/dashboard";
import Registration from "./components/Register/Register";
import User from "./components/reports/user";
import Food from "./components/reports/food";
import Booking from "./components/reports/booking";
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
