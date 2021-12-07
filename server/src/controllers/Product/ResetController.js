const { StatusCodes } = require('http-status-codes');
// const { products } = require('../../products.json');

class ProductResetController {
    constructor(redisClientService, dbMySQL) {
        this.redisClientService = redisClientService;
        this.dbMySQL = dbMySQL
    }

    async index(req, res) {
        let sql = 'SELECT * FROM producto WHERE fechaDiscontinuidad IS NULL'
        let productsMySQL;

        await this.dbMySQL.getConnection().then(async promiseConnection => {
            const [rows, fields] = await promiseConnection.execute(sql);
            productsMySQL = JSON.parse(JSON.stringify(rows));
            promiseConnection.connection.release();
        });

        const cartKeys = await this.redisClientService.scan('cart:*');

        for (const key of cartKeys) {
            await this.redisClientService.del(key);
        }

        for (const product of productsMySQL) {
            const { id } = product;
            product.price = (product.price).toFixed(2)

            await this.redisClientService.jsonSet(`product:${id}`, '.', JSON.stringify(product));
        }

        /* Test
        var a = productsMySQL[17]
        a.id = 28;
        await this.redisClientService.jsonSet(`product:27`, '.', JSON.stringify(a));
         */

        return res.sendStatus(StatusCodes.OK);
    }
}

module.exports = ProductResetController;
