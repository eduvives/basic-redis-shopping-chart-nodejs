// const { products } = require('../../products.json');

class ProductIndexController {
    constructor(redisClientService, dbMySQL) {
        this.redisClientService = redisClientService;
        this.dbMySQL = dbMySQL;
    }

    async index(req, res) {
        let sql = 'SELECT * FROM producto'
        let productsMySQLtest;
        let query = this.dbMySQL.query(sql, function (err, result) {
            if (err) throw err;
            productsMySQLtest = JSON.parse(JSON.stringify(result));
        });

        const productKeys = await this.redisClientService.scan('product:*');
        const productList = [];

        if (productKeys.length) {
            for (const key of productKeys) {
                const product = await this.redisClientService.jsonGet(key);

                productList.push(JSON.parse(product));
            }

            return res.send(productList);
        }

        for (const product of productsMySQLtest) {
            const { id } = product;

            await this.redisClientService.jsonSet(`product:${id}`, '.', JSON.stringify(product));

            productList.push(product);
        }

        return res.send(productList);
    }
}

module.exports = ProductIndexController;
