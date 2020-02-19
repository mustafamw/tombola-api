import mongoose from 'mongoose';
import { EventBetManagementSchema } from '../../mongoose/model/event-bet-management-schema';

export class EventGeneratorService { 

    constructor(data, userId, callback) {
        this.EventBetManagement =  mongoose.model('event-bets', EventBetManagementSchema);
        this._id = data._id;
        this.title = data.title;
        this.imageUrl = data.imageUrl;
        this.date = data.date;
        this.expires = data.expires;
        this.price = data.price;
        this.priceIncrease = data.priceIncrease;
        this.pricePercentage = data.pricePercentage;
        this.generateTickets(data, userId).then((tickets) => {
            this.tickets = tickets;
            callback(this);
        })
    }

    eventBetsMapping(data) {
        const eventBets = {};

        data.forEach((bet) => {
            if(!eventBets[bet.ticketNo]){
                eventBets[bet.ticketNo] = bet;
            }
        });

        return eventBets;
    };

    getEventBets(id) {
        return new Promise((resolve, reject) => {
            this.EventBetManagement.find({eventId: id}, (error, data) => {
                if(data && data.length > 0) {
                    resolve(this.eventBetsMapping(data))
                };
            });
        });
    };

    eventBetsOwner(data, userId, ticketNo) {
        return {
            disabled: data ? true : false,
            owner: data && data.userId === userId ? true : false,
            ticketNo
        }
    };

    generateTickets(data, userId) {
        const tickets = [];
        return new Promise((resolve, reject) => {
            this.getEventBets(data._id).then((eventBets) => {
                for(let i = data.minTicketNo; i <= data.maxTicketNo; i ++) {
                    tickets.push(this.eventBetsOwner(eventBets[i], userId, i));
                };
                resolve(tickets);
            })

        })
    };

}