import axios from 'axios';
export default async function getAllMessage({user_id }) {
  try {
    const { data } = await axios({
      method: 'get',
      url: `https://us-central1-a2-b00897744.cloudfunctions.net/message-passing/api/pubsub/topic/?userToken=${user_id}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data;
  } catch (error) {
    console.error('Something went wrong. Please try again.');
  }
}
