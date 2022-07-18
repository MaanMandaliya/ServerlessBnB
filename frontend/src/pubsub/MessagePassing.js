import React, {useState, useEffect} from 'react';
import '../App.css';
import getMsgs from './get-all-msgs';
import Notifications from "react-notifications-menu"
import SingleNotification from './SingleNotification';
import 'bootstrap-icons/font/bootstrap-icons.css';

import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
 
  let [messages, setMessages] = useState([]);
  // let [topic_name,setTopicName] = useState([]);

  const handleMessagePassing = async () => {

    // const topic_name = JSON.parse(localStorage.getItem('topicName'));
    // if (topic_name) {
    //  setItems(topic_name);
    // }
    const response = await getMsgs({
      // topicName : topic_name,
      topicName: 'pubsub-topic-test',
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