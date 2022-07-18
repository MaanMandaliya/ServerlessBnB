const { PubSub, v1 } = require('@google-cloud/pubsub');
const express = require('express');
const cors = require('cors');
const project_id = require('./a2-b00897744-023b9993be4f.json')[
  'project_id'
];
const app = express();

const pubsub = new PubSub({
  keyFilename: './a2-b00897744-023b9993be4f.json',
});
const sub_client = new v1.SubscriberClient({
  keyFilename: './a2-b00897744-023b9993be4f.json',
});



app.use(cors());
app.use(express.json());

app.post('/api/pubsub', async (req, res) => {
  const { userId } = req.body;
  const topicName = `pubsub-topic-${userId.toLowerCase().trim()}`;
  try {
    await pubsub.createTopic(topicName);
    return res.status(201).json({ topicName });
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
});


app.post('/api/pubsub/message', async (req, res) => {
  const { topicName, ackId } = req.body;
  const sub_name = `${topicName}-subscription`;
  try {
    const new_subscription = sub_client.subscriptionPath(
      project_id,
      sub_name,
    );
    const ackRequest = {
      subscription: new_subscription,
      ackIds: [ackId],
    };
    await sub_client.acknowledge(ackRequest);
    return res.status(200).json();
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
});

app.get('/api/pubsub/topic', async (req, res) => {
  const { topicName } = req.query;
  const sub_name = `${topicName}-subscription`;
  try {
    await pubsub.topic(topicName).createSubscription(sub_name);
  } catch (error) {}
  try {
    const new_subscription = sub_client.subscriptionPath(
      project_id,
      sub_name,
    );
    const [response] = await sub_client.pull({
      subscription: new_subscription,
      maxMessages: 10,
    });
    const messages = [];
    for (const message of response.receivedMessages) {
      messages.push({
        ...JSON.parse(message.message.data.toString()),
        ackId: message.ackId,
      });
    }
    return res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
});



app.post('/api/pubsub/topic', async (req, res) => {
  const { topicName, message } = req.body;
  try {
    await pubsub
      .topic(topicName)
      .publishMessage({ data: Buffer.from(JSON.stringify(message)) });
    return res.status(200).send();
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
});

app.listen(80);
