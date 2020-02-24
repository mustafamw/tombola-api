import mongoose from 'mongoose';
import { EventBetManagementSchema } from '../../mongoose/model/event-bet-management-schema';
import { EventManagementService } from '../event-service/event-service';
import { UserManagementService } from '../user-service/user-service';
import { EventBetValidationService } from '../event-bet-service/event-bet-validation';
 
const HttpStatus = require('http-status-codes');

export class EventBetManagementService {

    constructor() {
        this.EventBetManagement =  mongoose.model('event-bet', EventBetManagementSchema);
        this.EventManagementService = new EventManagementService();
        this.UserManagementService = new UserManagementService();
        this.EventBetValidationService = new EventBetValidationService();
    };

    betExists(data) {

        return new Promise((resolve, reject) => {
            this.EventBetManagement.find({
                eventId: data.eventId
            }, (error, eventBets) => {
                let ticketsAlreadyBet = [];
                eventBets.forEach((e) => {
                    ticketsAlreadyBet = ticketsAlreadyBet.concat(e.ticketNo)
                });
                const exists = this.EventBetValidationService.ticketBetExits(data.ticketNo, ticketsAlreadyBet);
                if(exists){
                    return reject({
                        message: "Event bet already taken", 
                        code: HttpStatus.CONFLICT
                    });
                }
                if(error){
                    return reject({
                        message: "Technical Error", 
                        code: HttpStatus.INTERNAL_SERVER_ERROR
                    });
                }
                return resolve();
            });
        });

    };

    bet(data) {

        const eventBetManagement = new this.EventBetManagement();
        eventBetManagement.userId = data.userId;
        eventBetManagement.eventId = data.eventId;
        eventBetManagement.ticketNo = data.ticketNo;

        return new Promise((resolve, reject) => {
            return this.UserManagementService.isUserIdValid(eventBetManagement.userId)
            .then(() => {
                return this.EventManagementService.eventAndTicketNoValid(eventBetManagement.eventId, eventBetManagement.ticketNo)
                .then(() => {
                    return this.betExists(data)
                    .then(() => {
                        return this.EventBetManagement.findOneAndUpdate({
                            userId: data.userId,
                            eventId: data.eventId
                        }, 
                        { 
                            $addToSet: { 
                                ticketNo: data.ticketNo  
                            } 
                        },
                        (error, data) => {
                            if(!data && !error) {
                                return eventBetManagement.save((err) => {
                                    if (err) {
                                        return this.rejected(reject, "Techinal Error", HttpStatus.INTERNAL_SERVER_ERROR);
                                    }
                                    return this.resolved(resolve, { message: "Successfully Inserted" });
                                });
                            }
                            if(data && !error) {
                                return this.resolved(resolve, { message: "Successfully Inserted" });
                            }
                            if(error) {
                                return this.rejected(reject, "Technical Error", HttpStatus.INTERNAL_SERVER_ERROR);
                            }
                        })
                    }, (error) => {
                        return this.rejected(reject, error.message, error.code);
                    });
                }, (error) => {
                    return this.rejected(reject, error.message, error.code);
                })
            }, (error) => {
                return this.rejected(reject, error.message, error.code);
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