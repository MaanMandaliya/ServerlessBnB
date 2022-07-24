import axios from 'axios';
export default async function publishMessage({ user_id, message }) {
  try {
    await axios({
      method: 'post',
      url: 'http://localhost/api/pubsub/topic',
      data: {
        userToken:user_id,
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
