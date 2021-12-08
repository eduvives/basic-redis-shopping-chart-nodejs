const { StatusCodes } = require('http-status-codes');

class ProductUpdateController {
    constructor(redisClientService, dbMySQL) {
        this.redisClientService = redisClientService;
        this.dbMySQL = dbMySQL;
    }

    async index(req, res) {
        // Set necessary parameters
        const {
            session: { cartId },
            params: { id: productId}
        } = req;
        let { name, price, stock } = req.body;
        
        // Get how many products are already added to carts
        const cartKeys = await this.redisClientService.scan('cart:*');
        let realStock = parseInt(stock);
        for (const key of cartKeys) {
            const quantityInCart =
                parseInt(await this.redisClientService.hget(key, `product:${productId}`)) || 0;
                realStock += quantityInCart;
        }
        // Update at MySQL
        let sql = 'UPDATE producto SET name = ?, price = ?, stock = ? WHERE id = ?'
        await this.dbMySQL.getConnection().then(async promiseConnection => {
            var connection = promiseConnection.connection;
            try {
                connection.beginTransaction();

                const result = await promiseConnection.execute(sql, [name, price, realStock, productId]);
                const affectedRows = result[0].affectedRows;
                connection.commit()
                console.info('Update successful');
            } catch (err) {
                console.error(`Error occurred while updating product: ${err.message}`, err);
                if (connection)  connection.rollback();
                console.info('Rollback successful');
            } finally {
                if (connection)  connection.release();
            }
        });
        // UPDATE product at Redis
        const newProduct = {id: productId, name: name, price: price, 
                            stock: stock, fechaDiscontinuidad: null};
        await this.redisClientService.jsonSet(`product:${productId}`, '.', JSON.stringify(newProduct));
        
        return res.sendStatus(StatusCodes.OK);
    }
}

module.exports = ProductUpdateController;
