const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const multer = require("multer");
const createError = require("http-errors");

require("dotenv").config();

const reviewsRouter = require("./routes/router");
const { getQueueClient } = require("./clients/queue");
const { updateReview } = require("./services/services");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.options("*", cors());

app.get("/", (req, res) => res.sendStatus(200));
app.use("/reviews", reviewsRouter);

// catch 404 and send to error handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  console.log(err);
  // res.locals.error = req.app.get("env") === "development" ? err : {};

  res.sendStatus(err.status || 500);
});

const queueClient = getQueueClient("QUEUE_NAME");

setInterval(async () => {
  const response = await queueClient.receiveMessages();
  if (response.receivedMessageItems.length > 0) {
    console.log(`Processing ${response.receivedMessageItems.length} messages`);
  }

  for (const message of response.receivedMessageItems) {
    console.log(`Received ${JSON.stringify(message)}`);
    try {
      const event = JSON.parse(message.messageText);
      switch (event.type) {
        case "thumbnail-created":
          await updateReview(event.data.id, event.data.thumbnailUrl);
          break;
        default:
          console.log(`Unknown event type processing queue: ${event.type}`);
      }
      await queueClient.deleteMessage(message.messageId, message.popReceipt);
    } catch (error) {
      console.error(`Error processing queue message: ${error}`);
    }
  }
}, 2000);

module.exports = app;
