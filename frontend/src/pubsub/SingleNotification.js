import React from 'react';
import classes from './SingleNotification.css';

import { useNavigate } from "react-router-dom";

const App = (props) => {
  const { message, category, index } = props.data;
  const navigate = useNavigate();
  const handleOnClick = async () => {
    
    switch (category) {
      case 'food': {
        navigate("/");
      }
      case 'booking': {
        navigate("/");
      }
      case 'tour': {
        navigate("/");
      }
      default: {
        navigate("/");
      }
    }
    console.log(index);
  };
  const handleLogo = () => {
    switch (category) {
      case 'food': {
        return 'bi bi-cup-hot';
      }
      case 'booking': {
        return 'bi bi-calendar-week';
      }
      case 'tour': {
        return 'bi bi-airplane';
      }
      default: {
        return 'bi bi-bell';
      }
    }
  };
  return (
    <div className={classes.card} onClick={handleOnClick} key={index} style = {{'--hover-color':'blue'}}>
      <div className={classes.cardcontent}>
        <div className={classes.image}>
          <i className={handleLogo()} style={{ fontSize: '1.5rem' ,"display":"flex",paddingLeft:'20px'}}></i>
        </div>
        <div className={classes.message}>
          <div className={classes.text} style={{ "display":"flex","flex-direction":"column","padding-bottom":"10px"}}>{message}</div>
        </div>
      </div>
    </div>
  );
};
export default App;
