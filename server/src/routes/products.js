const express = require('express');
const router = express.Router();
const checkSession = require('../middleware/checkSession');
const IndexController = require('../controllers/Product/IndexController');
const ResetController = require('../controllers/Product/ResetController');

module.exports = app => {
    const redisClientService = app.get('redisClientService');

    // Bind the middleware to our application (connection created to the MySQL database)
    const dbMySQL = app.get('dbMySQL');

    const indexController = new IndexController(redisClientService, dbMySQL);
    const resetController = new ResetController(redisClientService, dbMySQL);

    router.get('/', [checkSession], (...args) => indexController.index(...args));
    router.post('/reset', (...args) => resetController.index(...args));

    return router;
};
