import "./App.css";
import "primereact/resources/themes/md-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import Header from "./Custom-Components/Header/header";
import Login from "./Custom-Components/Login/Login";
import Questionnare from "./Custom-Components/Login/Questionnaire";
import CaesarCipher from "./Custom-Components/Login/CaesarCipher";
import Dashboard from "./Custom-Components/Dashboard/dashboard";
import Registration from "./Custom-Components/Register/Registration";
import User from "./Custom-Components/Reports/user";
import Food from "./Custom-Components/Reports/food";
import Booking from "./Custom-Components/Reports/booking";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FoodMenuList from "./Custom-Components/Food/foodMenu";
import OrderFeedback from "./Custom-Components/Food/orderFeedback";
import Rooms from "./Custom-Components/Hotel/Rooms";
import RoomFeedback from "./Custom-Components/Hotel/RoomFeedback";
import TourBooking from "./Custom-Components/Tour/TourBooking";
import TourFeedback from "./Custom-Components/Tour/TourFeedback";

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
          <Route path="/foodMenuList" element={<FoodMenuList />} />
          <Route path="/orderFeedback" element={<OrderFeedback />} />
          <Route path="/hotelBooking" element={<Rooms />} />
          <Route path="/hotelFeedback" element={<RoomFeedback />} />
          <Route path="/TourBooking" element={<TourBooking />} />
          <Route path="/TourFeedback" element={<TourFeedback />} />
        </Routes>
      </Router>
  
    </div>
  );
}

export default App;
