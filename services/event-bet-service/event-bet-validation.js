export class EventBetValidationService {

    constructor() {
    }

    ticketBetExits(ticketNo, ticketsAlreadyBet) {
        let valid = false;
        ticketNo.forEach((e) => {
            if (ticketsAlreadyBet.indexOf(e) >= 0) {
                valid = true;
            }
        });
        return valid;
    }
}