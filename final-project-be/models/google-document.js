import mongoose, { Schema } from "mongoose";
import { QUESTION_SCHEMA } from "./question.js";

const DOCUMENT_SCHEMA = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    documentName: {
        type: String,
        required: true
    },
    documentDescription: {
        type: String,
        required: true
    },
    createdByUserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    updatedOn: {
        type: Date,
        default: Date.now
    },
    questions: [QUESTION_SCHEMA]
});

const Document = mongoose.model("Document", DOCUMENT_SCHEMA);
export default Document;