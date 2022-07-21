import "./App.css";
import Header from "./Components/header/header";
import Login from "./Components/Login/Login";
import Questionnare from "./Components/Login/Questionnaire";
import CaesarCipher from "./Components/Login/CaesarCipher";
import Dashboard from "./Components/Dashboard/dashboard";
import Registration from "./Components/Register/Register";
import User from "./Components/reports/user";
import Food from "./Components/reports/food";
import Booking from "./Components/reports/booking";
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
