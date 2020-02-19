import mongoose from 'mongoose';
import { EventBetManagementSchema } from '../../mongoose/model/event-bet-management-schema';
 
const HttpStatus = require('http-status-codes');

export class EventBetManagementService {

    constructor() {
        this.EventBetManagement =  mongoose.model('event-bet', EventBetManagementSchema);
    };

    betExists(data) {

        return new Promise((resolve, reject) => {
            this.EventBetManagement.findOne({
                eventId: data.eventId,
                ticketNo: data.ticketNo
            }, (error, data) => {
                if(data && data != null){
                    return this.rejected(reject, "Event bet already taken", HttpStatus.CONFLICT);
                }
                if(error){
                    return this.rejected(reject, "Technical Error", HttpStatus.INTERNAL_SERVER_ERROR);
                }
                resolve();
            });
        });

    };

    bet(data) {

        const eventBetManagement = new this.EventBetManagement();
        eventBetManagement.userId = data.userId;
        eventBetManagement.eventId = data.eventId;
        eventBetManagement.ticketNo = data.ticketNo;
        
        return this.betExists(data).then(() => {
            return new Promise((resolve, reject) => {
                eventBetManagement.save((err) => {
                    if (err) {
                        return this.rejected(reject, "Techinal Error", HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    return this.resolved(resolve, { message: "Successfully Inserted" });
                });
            });
        });
    }

    resolved(resolve, message) {
        resolve(message);
        return;
    };

    rejected(reject, message, statusCode) {
        reject({
            message: message,
            statusCode: statusCode
        });
        return;
    };

}