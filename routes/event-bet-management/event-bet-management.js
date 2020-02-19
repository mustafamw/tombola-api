import { EventBetManagementService } from '../../services/event-bet-service/event-bet-service';

const mapping = '/event';
const router = require('express').Router();
const eventBetDatabase = new EventBetManagementService();

router.post(`${mapping}/bet`, (req, res) => {

    const data = req.body;

    eventBetDatabase.bet(data)
    .then((response) => {
        res.send(response);
    })
    .catch((error) => {
        res.statusCode = error.statusCode;
        res.send(error);
    });

});


export const EventBetManagement = router;