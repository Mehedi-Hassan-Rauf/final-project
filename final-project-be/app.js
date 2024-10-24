import express from 'express';
import bodyParser from 'body-parser';
import questionsRouter from './routes/google-document.js';
import userRouter from './routes/user.js';
import userResponseRouter from './routes/user-response.js';
import { corsConfig, REQUEST_FAILURE_MESSAGES, REQUEST_SUCCESS_MESSAGE, SECRET_KEY, SOCKET_EVENTS } from './common/constants.js';
import cors from "cors";
import mongoose from 'mongoose';
import { logger } from './common/pino.js';
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import path from "path";


const AUTHORISATION = "Authorization";
const SOCKET_CONNECTED = "Socket connected: ";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsConfig));
dotenv.config();

const __dirname = path.resolve();

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(express.static(path.join(__dirname, "/final-project-fe/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "final-project-fe", "dist", "index.html"));
});


// Test route
app.get("/", (req, res) => {
    res.json("Hello");
});

// for user authentication 
app.use((req, res, next) => {
  const authHeader = req.get(AUTHORISATION);
  if (!authHeader) {
    req.isUserAuth = false;
    return next();
  }

  const token = authHeader;
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    req.isUserAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isUserAuth = false;
    return next();
  }
  req.userId = decodedToken.userId;
  req.isUserAuth = true;
  next();
});

// routes for user
app.use(userRouter);

// document routes
app.use(questionsRouter);

//collecting user responses
app.use(userResponseRouter);

mongoose.connect(process.env.MONGO_URL?process.env.MONGO_URL:"")
  .then(() => {
    logger.info(REQUEST_SUCCESS_MESSAGE.DATABASE_CONNECTED_SUCCESSFULLY);
    const server = app.listen(process.env.PORT || 9000, () => {
      logger.info(REQUEST_SUCCESS_MESSAGE.APP_STARTED);
    });

    const io = require('./common/Socket').init(server);
    io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
      logger.info(SOCKET_CONNECTED, socket.id);
    });
  })
  .catch((err) => {
    logger.error(REQUEST_FAILURE_MESSAGES.ERROR_IN_CONNECTING_DB, err);
    logger.error(REQUEST_FAILURE_MESSAGES.APP_CRASHED);
    process.exit();
  });
