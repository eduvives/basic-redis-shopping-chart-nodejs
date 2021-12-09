const { StatusCodes } = require('http-status-codes');

class ProductAddController {
    constructor(redisClientService, dbMySQL) {
        this.redisClientService = redisClientService;
        this.dbMySQL = dbMySQL;
    }

    async index(req, res) {
        // Set necessary parameters
        let { name, price, stock } = req.body;

        let sql;

        // TODO

        return res.sendStatus(StatusCodes.OK);
    }
}

module.exports = ProductAddController;
