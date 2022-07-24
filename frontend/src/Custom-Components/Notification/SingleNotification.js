import React from 'react';
import classes from './SingleNotification.css';
import { useNavigate } from "react-router-dom";
// import 'bootstrap-icons/font/bootstrap-icons.css';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Icon } from '@mui/material';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';


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
      case 'kitchen': {
        return 'FoodBankIcon';
      }
      case 'hotel': {
        return 'BedroomParentIcon';
      }
      case 'tour': {
        return 'AirplaneTicketIcon';
      }
      default: {
        return 'NotificationsActiveIcon';
      }
    }
  };
  return (
    <div onClick={handleOnClick} > <Card>
     
      <NotificationsActiveIcon/>
      </Card>
    <Card onClick={handleOnClick} >
          <CardContent>
         
            <Typography
            sx={{ fontSize: 14 }}
            >
              {message}
            </Typography>
            </CardContent>
            </Card>
            
            
            </div>
    
//     <div className={classes.card} onClick={handleOnClick} key={index} style = {{'--hover-color':'blue'}}>
//       <div className={classes.cardcontent}>
//         <div className={classes.image}>
//           {/* <i className={handleLogo()} style={{ fontSize: '1.5rem' ,"display":"flex",paddingLeft:'20px'}}></i> */}
//           {/* <Icon icon={handleLogo()} className="someClass" /> */}
// <NotificationsActiveIcon/>
//         </div>
//         <div className={classes.message}>
//           <div className={classes.text} style={{ "display":"flex","flex-direction":"column","padding-bottom":"10px"}}>{message}</div>
//         </div>
//       </div>
//     </div>
  );
};
export default App;
