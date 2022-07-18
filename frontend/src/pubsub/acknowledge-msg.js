import axios from 'axios';
export default async function getAllMessage({ topicName, acknowledgementId }) {
  try {
    const { data } = await axios({
      method: 'post',
      url: 'http://localhost/api/pubsub/message/',
      data: {
        topicName,
        acknowledgementId,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data.data;
  } catch (error) {
    console.error('Something went wrong. Please try again.');
  }
}
