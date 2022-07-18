import axios from 'axios';
export default async function publishMessage({ topicName, message }) {
  try {
    await axios({
      method: 'post',
      url: 'http://localhost/api/pubsub/topic',
      data: {
        topicName,
        message,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return;
  } catch (error) {
    console.error('Something went wrong. Please try again.');
  }
}
