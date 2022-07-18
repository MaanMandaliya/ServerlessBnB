import "./App.css";
import Header from "./components/header/header";
import User from "./components/reports/user";
import Food from "./components/reports/food";
import Booking from "./components/reports/booking";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div>
      <Header />
      <Router>
        <Routes>
          <Route path="user-report" element={<User />}></Route>
          <Route path="food-report" element={<Food />} />
          <Route path="booking-report" element={<Booking />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
