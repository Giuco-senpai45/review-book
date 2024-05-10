const { QueueClient } = require("@azure/storage-queue");

const getQueueClient = (queueName) =>
  new QueueClient(process.env.CONNECTION_STRING, queueName);

module.exports = { getQueueClient };
