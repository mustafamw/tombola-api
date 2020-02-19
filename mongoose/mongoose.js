import mongoose from 'mongoose';
import { config } from '../config/config';

export class Mongoose {

    constructor() {
    }
    
    connect() {
      mongoose.connect(config.mongodb.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }
}