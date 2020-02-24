import mongoose from 'mongoose';
import { EventBetManagementSchema } from '../../mongoose/model/event-bet-management-schema';
import { DateTimeService } from '../date-time-service/date-time-service';

export class EventGeneratorService { 

    constructor(data, userId, callback) {
        this.EventBetManagement =  mongoose.model('event-bets', EventBetManagementSchema);
        this.dateTimeService = new DateTimeService();
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
            delete this.dateTimeService;
            callback(this);
        })
    }

    eventBetsMapping(data) {
        const eventBets = {};

        data.forEach((bet) => {
            bet.ticketNo.forEach((e) => {
                if(!eventBets[e]){
                    eventBets[e] = bet;
                }
            })
        });

        return eventBets;
    };

    getEventBets(id) {
        return new Promise((resolve, reject) => {
            this.EventBetManagement.find({eventId: id}, (error, data) => {
                if(data) {
                    resolve(this.eventBetsMapping(data))
                };
            });
        });
    };

    eventBetsOwner(data, userId, ticketNo, valid) {
        const bet = {
            disabled: data || !valid ? true : false,
            owner: data && data.userId === userId ? true : false,
            ticketNo
        }

        return bet;
    };

    generateTickets(data, userId) {
        const tickets = [];
        return new Promise((resolve, reject) => {
            this.getEventBets(data._id).then((eventBets) => {
                const valid = this.dateTimeService.isValid(data.expires);
                for(let i = data.minTicketNo; i <= data.maxTicketNo; i ++) {
                    tickets.push(this.eventBetsOwner(eventBets[i], userId, i, valid));
                };
                resolve(tickets);
            })

        })
    };

}