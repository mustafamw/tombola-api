export class EventValidationService {

    constructor() {
    }

    isTicketValid(event, tickets) {
        let valid = true;
        if (tickets && Array.isArray(tickets) && tickets.length > 0) {
            tickets.forEach((e) => {
                if (e < event.minTicketNo || e > event.maxTicketNo) {
                    valid = false;
                };
            });
        } else {
            valid = false;
        }
        return valid;
    }
}