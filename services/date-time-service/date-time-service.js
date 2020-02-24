import moment from 'moment';

export class DateTimeService {

    constructor() {

    };

    isValid(expires) {
        const currentDate = moment();
        const expiresDate = moment(expires);
        if(currentDate <= expiresDate){
            return true;
        }
        return false;
    }
}