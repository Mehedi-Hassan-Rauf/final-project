import { logger } from "../common/pino.js";
import { REQUEST_FAILURE_MESSAGES, REQUEST_SUCCESS_MESSAGE, SECRET_KEY } from "../common/constants.js";
const Users = require('../models/user.js');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const LOGGED_IN = "Logged In";
const ONE_DAY = "1d";

export const getUserByIdController = (req, res) => { 
  Users.find({ username: req.params.id })
    .then((result) => { 
      logger.info(REQUEST_SUCCESS_MESSAGE.USER_LOGGEDIN_SUCCESSFULLY);
      res.status(200).send(result);
    })
    .catch((error) => { 
      logger.error(REQUEST_FAILURE_MESSAGES.ERROR_IN_FETCHING_USER_DATA, error?.message);
    });
};

export const signUpUserController = (req, res) => { 
  try {
    let user = new Users(req.body);
    Users.find({ email: req.body.email }).then((response) => { 
      if (response.length > 0) {
        res.status(403).send(REQUEST_FAILURE_MESSAGES.USER_ALREADY_EXISTS);
      } else {
        bcrypt.hash(user.password, 12).then((hashedPassword) => { 
          user.password = hashedPassword;
          user.save().then((response) => { 
            logger.info(REQUEST_SUCCESS_MESSAGE.USER_CREATED_SUCCESSFULLY, req.body.email);

            const token = jwt.sign(
              {
                email: response.email,
                username: response.username,
                userId: response._id.toString()
              },
              SECRET_KEY,
              { expiresIn: ONE_DAY }
            );

            logger.info(REQUEST_SUCCESS_MESSAGE.USER_LOGGEDIN_SUCCESSFULLY, { email: response.email, username: response.username });

            
            res.status(200).json({
              message: LOGGED_IN,
              token: token,
              userId: response._id.toString(),
              data: { email: response.email, username: response.username }
            });
          });
        });
      }
    });
  } catch (error) {
    logger.error(REQUEST_FAILURE_MESSAGES.UNABLE_TO_CREATE_USER, req.body.email, error);
    res.status(500).send(REQUEST_FAILURE_MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const signInUserController = (req, res) => { 
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: REQUEST_FAILURE_MESSAGES.PLEASE_ENTER_ALL_FIELDS });
  }

  Users.find({ email: email }).then((user) => { 
    if (user.length === 0) {
      logger.error(REQUEST_FAILURE_MESSAGES.USER_DATA_NOT_FOUND, email);
      res.status(403).send({ message: REQUEST_FAILURE_MESSAGES.USER_DATA_NOT_FOUND });
    } else {
      const { email, username, _id } = user[0];
      bcrypt.compare(password, user[0].password)
        .then((isMatched) => { 
          if (!isMatched) {
            res.status(402).send({ message: REQUEST_FAILURE_MESSAGES.PASSWORD_INCORRECT });
          } else {
            const token = jwt.sign(
              {
                email,
                username,
                userId: _id.toString()
              },
              SECRET_KEY,
              { expiresIn: ONE_DAY }
            );
            logger.info(REQUEST_SUCCESS_MESSAGE.USER_LOGGEDIN_SUCCESSFULLY, { email, username });
            res.status(200).json({
              message: LOGGED_IN,
              token: token,
              userId: _id.toString(),
              data: { email, username }
            });
          }
        })
        .catch((error) => { 
          logger.error(REQUEST_FAILURE_MESSAGES.UNABLE_TO_SIGNIN_USER, email, error);
          res.status(401).send(REQUEST_FAILURE_MESSAGES.UNABLE_TO_SIGNIN_USER);
        });
    }
  }).catch((error) => { 
    logger.error(REQUEST_FAILURE_MESSAGES.UNABLE_TO_SIGNIN_USER, email, error);
    res.status(500).send(REQUEST_FAILURE_MESSAGES.UNABLE_TO_SIGNIN_USER);
  });
};
