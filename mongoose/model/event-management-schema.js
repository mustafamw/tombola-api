
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

export const EventManagementSchema = new Schema({
  id: ObjectId,
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  minTicketNo: {
    type: Number,
    required: true
  },  
  maxTicketNo: {
    type: Number,
    required: true
  },
  maxTicketNo: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  priceIncrease: {
    type: Number,
    required: true
  },
  pricePercentage: {
    type: Number,
    required: true
  },
  expires:{
    type: Date,
    default: Date.now
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});