import React, {useState, useEffect} from 'react';
import '../App.css';
import getMsgs from './get-all-msgs';
import Notifications from "react-notifications-menu"
import SingleNotification from './SingleNotification';
import 'bootstrap-icons/font/bootstrap-icons.css';

import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
 
  let [messages, setMessages] = useState([]);
  // let [user_email,setUserEmail] = useState([]);

  const handleMessagePassing = async () => {

    // const user_email = JSON.parse(localStorage.getItem('topicName'));
    // if (user_email) {
    //  setItems(user_email);
    // }
    const response = await getMsgs({
      
      userToken: 'pubsub-topic-'+user_email,
    });
    const newMessages = response.messages.map((item, index) => ({
      ...item,
      index,
    }));
    setMessages(newMessages);
  };
  useEffect(() => {
    handleMessagePassing();
  }, []);
  
 

  return (
    <div className="App">
    

<Notifications
          data={messages}
          notificationCard={SingleNotification}
          markAsRead={(data) => console.log('MARKASREAD --> ', data)}
        />


    
              
    </div>
  );

  
}

export default Home;