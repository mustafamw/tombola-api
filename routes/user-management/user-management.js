import { UserManagementService } from '../../services/user-service/user-service';

const mapping = '/user';
const router = require('express').Router();
const userDatabase = new UserManagementService();

router.post(`${mapping}/signup`, (req, res) => {
    const data = req.body;
    userDatabase.insert(data)
    .then((response) => {
        res.send(response);
    })
    .catch((error) => {
        res.statusCode = error.statusCode;
        res.send(error);
    });
});

router.post(`${mapping}/login`, (req, res) => {
    const data = req.body;
    userDatabase.login(data)
    .then((response) => {
        res.send(response);
    })
    .catch((error) => {
        res.statusCode = error.statusCode;
        res.send(error);
    });
});

export const UserManagement = router;