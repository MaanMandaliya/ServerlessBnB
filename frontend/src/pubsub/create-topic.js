import axios from 'axios';
export default async function createTopic({ userId }) {
  try {
    const { data } = await axios({
      method: 'post',
      url: 'http://localhost/api/pubsub',
      data: {
        userId,
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
