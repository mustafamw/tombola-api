import { EventManagementService } from '../../services/event-service/event-service';

const mapping = '/event';
const router = require('express').Router();
const eventDatabase = new EventManagementService();

router.post(`${mapping}/valid/:id`, (req, res) => {
    eventDatabase.pageValid(req.params.id)
    .then((response) => {
        res.send(response);
    })
    .catch((error) => {
        res.statusCode = error.statusCode;
        res.send(error);
    });
});

router.post(`${mapping}/create`, (req, res) => {
    const data = req.body;
    eventDatabase.create(data)
    .then((response) => {
        res.send(response);
    })
    .catch((error) => {
        res.statusCode = error.statusCode;
        res.send(error);
    });
});

router.get(`${mapping}/list`, (req, res) => {
    eventDatabase.getList()
    .then((response) => {
        res.send(response);
    })
    .catch((error) => {
        res.statusCode = error.statusCode;
        res.send(error);
    });
});

router.get(`${mapping}/list/:id`, (req, res) => {
    let userId = req.headers['x-userid'];
    userId = userId && userId.length > 0 ? userId: '';
    eventDatabase.getListId(req.params.id, userId)
    .then((response) => {
        res.send(response);
    })
    .catch((error) => {
        res.statusCode = error.statusCode;
        res.send(error);
    });
});

export const EventManagement = router;