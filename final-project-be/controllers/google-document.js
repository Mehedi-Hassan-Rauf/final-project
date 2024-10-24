import { REQUEST_FAILURE_MESSAGES, REQUEST_SUCCESS_MESSAGE, UNAUTHORIZED_ACCESS } from "../common/constants.js";
import { logger } from "../common/pino.js";
const Document = require('../models/google-document.js');

let mongoose = require("mongoose");

export const getGoogleDocumentByIdController = (req, res) => { 
  if (!req?.isUserAuth) {
    res.status(401).send({ message: UNAUTHORIZED_ACCESS });
  } else {
    Document.find({ _id: req.params.documentId }).then((response) => { 
      logger.info(REQUEST_SUCCESS_MESSAGE.DOCUMENT_DATA_IS_FETCHED);
      res.status(200).send({
        document: response[0]
      });
    }).catch((error) => { 
      logger.error(REQUEST_FAILURE_MESSAGES.ERROR_IN_FETCHING_THE_DOCUMENT, error.message);
      res.status(500).json(error);
    });
  }
};

export const getAllDocumentIds = (req, res) => { 
  if (!req?.isUserAuth) {
    res.status(401).send({ message: UNAUTHORIZED_ACCESS });
  }
  req.body.userId = new mongoose.Types.ObjectId(req.body.userId);
  Document.find({ createdByUserID: req.body.userId }, { documentName: true, _id: true, createdOn: true, updatedOn: true }).then((response) => { 
    res.status(200).send({
      documents: response
    });
  }).catch((error) => { 
    logger.error(REQUEST_FAILURE_MESSAGES.ERROR_IN_FETCHING_THE_DOCUMENT, error.message);
    res.status(500).send([]);
  });
};


export const createNewDocument = (req, res) => { 
  if (!req?.isUserAuth) {
    res.status(401).send({ message: UNAUTHORIZED_ACCESS });
  } else {
    let document = new Document(req.body);
    req.body.createdByUserID = new mongoose.Types.ObjectId(req.body.createdByUserID);

    document.save().then((response) => { 
      logger.info(REQUEST_SUCCESS_MESSAGE.DOCUMENT_CREATED_SUCCESSFULLY, response._id);
      res.status(201).send({
        message: REQUEST_SUCCESS_MESSAGE.DOCUMENT_CREATED_SUCCESSFULLY,
        documentId: response._id,
        document: {
          documentName: response.documentName,
          createdOn: response.createdOn,
          updatedOn: response.updatedOn
        }
      });
    }).catch((error) => { 
      logger.error(REQUEST_FAILURE_MESSAGES.ERROR_IN_CREATING_NEW_DOCUMENT, req.body.createdBy, error.message);
      res.status(500).json(error);
    });
  }
};


export const updateDocument = (req, res) => { 
  if (!req?.isUserAuth) {
    res.status(401).send({ message: UNAUTHORIZED_ACCESS });
  }
  const document = {
    documentName: req.body.documentName,
    documentDescription: req.body.documentDescription,
    questions: req.body.questions,
    updatedOn: req.body.updatedOn
  };

  Document.findByIdAndUpdate((req.body._id).trim(), { $set: document }, { new: false }).then(() => { 
    logger.info(REQUEST_SUCCESS_MESSAGE.DOCUMENT_UPDATED_SUCCESSFULLY, req.body._id);
    res.status(200).send({ code: 200, message: REQUEST_SUCCESS_MESSAGE.DOCUMENT_UPDATED_SUCCESSFULLY });
  }).catch((error) => { 
    logger.error(REQUEST_FAILURE_MESSAGES.UNABLE_TO_UPDATE_DOCUMENT, req.body._id, error);
    res.status(500).send(REQUEST_FAILURE_MESSAGES.INTERNAL_SERVER_ERROR);
  });
};

export const deleteDocument = (req, res) => { 
  if (!req.isUserAuth) {
    res.status(401).send({ message: UNAUTHORIZED_ACCESS });
  }

  let documentId = req.params?.documentId;
  Document.deleteOne({ _id: documentId }).then(() => {
    logger.info(REQUEST_SUCCESS_MESSAGE.DOCUMENT_DELETED_SUCCESSFULLY, req.body._id);
    res.status(200).json({ msg: REQUEST_SUCCESS_MESSAGE.DOCUMENT_DELETED_SUCCESSFULLY, documentId });
  }).catch((error) => { 
    logger.error(REQUEST_FAILURE_MESSAGES.DOCUMENT_DELETION_FAILED, req.body._id, error);
    res.json({ msg: REQUEST_FAILURE_MESSAGES.DOCUMENT_DELETION_FAILED });
  });
};
