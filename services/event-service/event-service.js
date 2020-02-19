import mongoose from 'mongoose';
import { EventManagementSchema } from '../../mongoose/model/event-management-schema';
import { EventGeneratorService } from './event-generator';
 
const HttpStatus = require('http-status-codes');

export class EventManagementService {

    constructor() {
        this.EventManagement =  mongoose.model('event', EventManagementSchema);
    };

    create(data) {

        const eventManagement = new this.EventManagement();
        eventManagement.title = data.title;
        eventManagement.imageUrl = data.imageUrl;
        eventManagement.minTicketNo = data.minTicketNo;
        eventManagement.maxTicketNo = data.maxTicketNo;
        eventManagement.price = data.price;
        eventManagement.priceIncrease = data.priceIncrease;
        eventManagement.pricePercentage = data.pricePercentage;

        return new Promise((resolve, reject) => {
            eventManagement.save((err) => {
                if (err) {
                    return this.rejected(reject, "Techinal Error", HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return this.resolved(resolve, { message: "Successfully Inserted" });
            });
        });

    };

    pageValid(id) {

        return new Promise((resolve, reject) => {
            this.EventManagement.findById(id, (error, data) => {
                if((error && error !== null) || (data === null || !data || data.length === 0)){
                    return this.rejected(reject, "Event Not Found", HttpStatus.NOT_FOUND);
                }
                return this.resolved(resolve);
            });
        });

    };
    
    getList() {

        return new Promise((resolve, reject) => {
            this.EventManagement.find({}, (error, data) => {
                if((error && error !== null) || (data && data.length === 0)){
                    return this.rejected(reject, "Event List Not Found", HttpStatus.NOT_FOUND);
                }
                return this.resolved(resolve, data);
            });
        });

    };

    getListId(id, userId) {

        return new Promise((resolve, reject) => {
            this.EventManagement.findById(id, (error, data) => {
                if(error === null || (data !== undefined && data)){
                    new EventGeneratorService(data, userId, (mapping) => {
                        return this.resolved(resolve, mapping);
                    });
                } else {
                    return this.rejected(reject, "Event Not Found", HttpStatus.NOT_FOUND);
                }
            });
        });

    };

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