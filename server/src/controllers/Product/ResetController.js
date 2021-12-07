const { StatusCodes } = require('http-status-codes');
// const { products } = require('../../products.json');

class ProductResetController {
    constructor(redisClientService, dbMySQL) {
        this.redisClientService = redisClientService;
        this.dbMySQL = dbMySQL
    }

    async index(req, res) {
        let sql = 'SELECT * FROM producto WHERE fechaDiscontinuidad IS NULL'
        let productsMySQLtest;
        let query = this.dbMySQL.query(sql, function (err, result) {
            if (err) throw err;
            productsMySQLtest = JSON.parse(JSON.stringify(result));
        });

        const cartKeys = await this.redisClientService.scan('cart:*');

        for (const key of cartKeys) {
            await this.redisClientService.del(key);
        }

        for (const product of productsMySQLtest) {
            const { id } = product;

            await this.redisClientService.jsonSet(`product:${id}`, '.', JSON.stringify(product));
        }

        return res.sendStatus(StatusCodes.OK);
    }
}

module.exports = ProductResetController;
