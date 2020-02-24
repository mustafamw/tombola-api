
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

export const EventBetManagementSchema = new Schema({
  id: ObjectId,
  eventId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  ticketNo: {
    type: [Number],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});