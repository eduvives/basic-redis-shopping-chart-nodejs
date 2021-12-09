// const { products } = require('../../products.json');

class ProductIndexController {
    constructor(redisClientService, dbMySQL) {
        this.redisClientService = redisClientService;
        this.dbMySQL = dbMySQL;
    }

    async index(req, res) {
        let sql = 'SELECT * FROM producto WHERE fechaDiscontinuidad IS NULL'
        let productsMySQL;

        await this.dbMySQL.getConnection().then(async promiseConnection => {
            const [rows, fields] = await promiseConnection.execute(sql);
            productsMySQL = JSON.parse(JSON.stringify(rows));
            promiseConnection.connection.release();
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

        for (const product of productsMySQL) {
            const { id } = product;
            product.price = (product.price).toFixed(2)

            // UPDATE product at Redis without discontinuation date
            const newProduct = {id: product.id, name: product.name, price: product.price, stock: product.stock};

            await this.redisClientService.jsonSet(`product:${id}`, '.', JSON.stringify(newProduct));

            productList.push(product);
        }

        return res.send(productList);
    }
}

module.exports = ProductIndexController;
