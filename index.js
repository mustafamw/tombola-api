const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const createMiddleware = require('swagger-express-middleware');
const cors = require('cors');
const opn = require('opn');

import { Mongoose } from './mongoose/mongoose';
import { routes } from './routes/routes';
import { config } from './config/config';

const mongoose = new Mongoose();
mongoose.connect();

const domain = config.application.domain;
const port = config.application.port !== 80 ? `:${config.application.port}` : '';
if(config.application.domain){
    swaggerDocument.host = `${domain}${port}`;
}

createMiddleware(swaggerDocument, app, (err, middleware) => {

    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
        res.setHeader('Access-Control-Allow-Headers', '*');
        next();
    });

    app.use(middleware.metadata());
    app.use(middleware.parseRequest());

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    
    app.use(bodyParser.json());

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use('/api/v1', routes);
    
    // Error handler to display the validation error as HTML
    app.use((err, req, res, next) => {
        res.status(err.status);
        res.send({message: err.message});
    });

    app.listen(config.application.port,() => {
        opn(`${swaggerDocument.host + config.swagger.path}`);
    });
});

