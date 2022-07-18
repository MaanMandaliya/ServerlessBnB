import axios from 'axios';
export default async function getAllMessage({ topicName }) {
  try {
    const { data } = await axios({
      method: 'get',
      url: `http://localhost/api/pubsub/topic/?topicName=${topicName}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data;
  } catch (error) {
    console.error('Something went wrong. Please try again.');
  }
}
