import { logger } from "../common/pino.js";
import { getIo } from "../common/Socket.js";
import { REQUEST_FAILURE_MESSAGES, REQUEST_SUCCESS_MESSAGE, SOCKET_CHANNEL_NAMES } from "../common/constants.js";

const UserReponse = require('../models/user-response.js');

export const getUserResponseController = (req, res) => { 
  UserReponse.find({ documentId: req.params.documentId }, { _id: 0, answers: 0, __v: 0 }).populate({
    path: 'userId',
    model: 'User',
    select: 'username _id'
  })
    .then((responseData) => { 
      res.status(200).send({
        formResponses: responseData
      });
    }).catch((error) => { 
      logger.error(REQUEST_FAILURE_MESSAGES.ERROR_IN_FETCHING_USER_RESPONSE, error.message);
      res.status(500).json({ "message": REQUEST_FAILURE_MESSAGES.ERROR_IN_FETCHING_USER_RESPONSE });
    });
};

export const fetchUserResponseData = (req, res) => { 
  UserReponse.find({ documentId: req.params.documentId, userId: req.params.userId }, { _id: 0, __v: 0 })
    
    .populate({
      path: 'documentId',
      model: 'Document',
      select: '-_id -createdByUserID -createdOn -updatedOn -__v'
    })
    
    .populate({
      path: 'userId',
      model: 'User',
      select: 'username -_id'
    }).then((response) => { 
      response = response[0];
      let data = {
        documentName: response.documentId.documentName,
        documentDescription: response.documentId.documentDescription,
        questions: response.documentId.questions,
        username: response.userId.username,
        answers: response.answers,
        submittedOn: response.submittedOn
      };
      res.status(200).send(data);
    }).catch((error) => { 
      logger.error(REQUEST_FAILURE_MESSAGES.ERROR_IN_FETCHING_USER_RESPONSE, error.message);
      res.status(500).json({ "message": REQUEST_FAILURE_MESSAGES.ERROR_IN_FETCHING_USER_RESPONSE });
    });
};

export const saveUserResponseController = (req, res) => { 
  let userResponse = { ...req.body };
  let username = req.body.username;
  delete userResponse.username;

  UserReponse.findOneAndUpdate({ userId: req.body.userId, documentId: req.body.documentId },
    { $set: userResponse },
    { upsert: true, returnOriginal: false }).then((formResponse) => { 
      logger.info(REQUEST_SUCCESS_MESSAGE.RESPONSE_SAVED_SUCCESSFULLY, formResponse._id);
      getIo().emit(SOCKET_CHANNEL_NAMES.USER_RESPONSE, {
        userId: { _id: formResponse.userId, username },
        submittedOn: formResponse.submittedOn,
        documentId: formResponse.documentId
      });

      res.status(201).send({
        message: REQUEST_SUCCESS_MESSAGE.RESPONSE_SAVED_SUCCESSFULLY,
        documentId: formResponse._id
      });
    }).catch((error) => { 
      logger.error(REQUEST_FAILURE_MESSAGES.ERROR_INSAVING_USER_RESPONSE, `${req.body.username}, ${error.message}`);
      res.status(500).json({ "message": REQUEST_FAILURE_MESSAGES.ERROR_INSAVING_USER_RESPONSE });
    });
};
