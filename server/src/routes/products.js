const express = require('express');
const router = express.Router();
const checkSession = require('../middleware/checkSession');
const IndexController = require('../controllers/Product/IndexController');
const ResetController = require('../controllers/Product/ResetController');
const UpdateController = require('../controllers/Product/UpdateController');
const DeleteItemController = require('../controllers/Product/DeleteItemController');
const AddItemController = require('../controllers/Product/AddItemController');

module.exports = app => {
    const redisClientService = app.get('redisClientService');

    // Bind the middleware to our application (connection created to the MySQL database)
    const dbMySQL = app.get('dbMySQL');

    const indexController = new IndexController(redisClientService, dbMySQL);
    const resetController = new ResetController(redisClientService, dbMySQL);
    const updateController = new UpdateController(redisClientService, dbMySQL);
    const deleteItemController = new DeleteItemController(redisClientService, dbMySQL);
    const addItemController = new AddItemController(redisClientService, dbMySQL);

    router.get('/', [checkSession], (...args) => indexController.index(...args));
    router.post('/reset', (...args) => resetController.index(...args));
    router.put('/:id', [checkSession], (...args) => updateController.index(...args));
    router.delete('/:id', [checkSession], (...args) => deleteItemController.index(...args));
    router.post('/add', [checkSession], (...args) => addItemController.index(...args));

    return router;
};
