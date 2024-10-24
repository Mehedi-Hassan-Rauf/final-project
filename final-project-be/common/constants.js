export const corsConfig = {
  origin: 'https://final-project-fe-psi.vercel.app',
  allowedHeaders: [
    "Authorization",
    "X-Requested-With",
    "Content-Type",
    "x-auth-token"
  ],
  maxAge: 86400, // NOTICE: 1 day
  credentials: true
};

// SUCCESS MESSAGES
export const REQUEST_SUCCESS_MESSAGE = {
  DOCUMENT_CREATED_SUCCESSFULLY: "Document created successfully",
  DOCUMENT_UPDATED_SUCCESSFULLY: 'Document updated successfully',
  DOCUMENT_DELETED_SUCCESSFULLY: "Document Deleted Successfully",
  DOCUMENT_DATA_IS_FETCHED: `User fetched data`,
  USER_CREATED_SUCCESSFULLY: "User created successfully",
  USER_LOGGEDIN_SUCCESSFULLY: "User logged in successfully",
  RESPONSE_SAVED_SUCCESSFULLY: "Response saved successfully",
  DATABASE_CONNECTED_SUCCESSFULLY: "Mongoose connected successfully...",
  APP_STARTED: `Express server is up and running`
};

// FAILURE MESSAGES
export const REQUEST_FAILURE_MESSAGES = {
  DOCUMENT_DELETION_FAILED: "Unable to delete the document...!",
  DOCUMENT_DATAIS_FETCHED: `User fetched data`,
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  PLEASE_ENTER_ALL_FIELDS: "Please enter all fields",
  USER_ALREADY_EXISTS: 'User already exists, try new email address',
  USER_DATA_NOT_FOUND: "User data not found..!",
  PASSWORD_INCORRECT: "Password is incorrect..!",
  UNABLE_TO_CREATE_USER: "Unable to create the user,",
  UNABLE_TO_SIGNIN_USER: "Unable to sign in the user,",
  ERROR_IN_FETCHING_USER_DATA: "Error in fetching the user data,",
  ERROR_IN_FETCHING_USER_RESPONSE: "Error in fetching the responses,",
  ERROR_INSAVING_USER_RESPONSE: "Error in saving the user response",
  APP_CRASHED: "App crashed",
  ERROR_IN_CONNECTING_DB: "Unable to connect the MongoDB database",
  UNABLE_TO_UPDATE_DOCUMENT: "Unable to update document, ",
  ERROR_IN_FETCHING_THE_DOCUMENT: "Error in fetching the documents,",
  ERROR_IN_CREATING_NEW_DOCUMENT: "Error in creating new document"
};

// SOCKET CHANNEL NAMES
export const SOCKET_CHANNEL_NAMES = {
  USER_RESPONSE: 'USER_RESPONSE'
};

// SOCKET EVENTS
export const SOCKET_EVENTS = {
  CONNECTION: "connection"
};

// API REQUEST ROUTES
export const API_REQUEST_ROUTES = {
  GET_USER_BY_ID: '/:id',
  USER_LOGIN: '/login',
  USER_REGISTER: '/register',
  GET_DOCUMENT_BY_DOCUMENT_ID: '/document/:documentId',
  GET_ALL_DOCUMENTS: '/documents',
  CREATE_NEW_DOCUMENT: '/create-document',
  UPDATE_DOCUMENT: '/update-document',
  DELETE_DOCUMENT_BY_ID: '/delete/:documentId',
  GET_USER_RESPONSE_BY_ID: '/user-response/:documentId',
  SAVE_USER_RESPONSE: '/user-response/:documentId',
  GET_USER_RESPONSE_BY_USER_ID: '/user-response/:userId/:documentId'
};

export const UNAUTHORIZED_ACCESS = "Unauthorized resource access..!";
export const SECRET_KEY = "somesupersecretsecret";
