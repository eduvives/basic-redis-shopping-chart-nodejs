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
        let { name, price, stock, oldName, oldPrice, oldStock } = req.body;

        let stockChanged = stock !== oldStock
        let sql;
        let realStock;

        if (stockChanged) {
            // Get how many products are already added to carts
            const cartKeys = await this.redisClientService.scan('cart:*');
            realStock = parseInt(stock);
            for (const key of cartKeys) {
                const quantityInCart =
                    parseInt(await this.redisClientService.hget(key, `product:${productId}`)) || 0;
                realStock += quantityInCart;
            }
            // Update at MySQL
            sql = 'UPDATE producto SET name = ?, price = ?, stock = ? WHERE id = ?'
        } else {
            // Update at MySQL
            sql = 'UPDATE producto SET name = ?, price = ? WHERE id = ?'
        }

        await this.dbMySQL.getConnection().then(async promiseConnection => {
            var connection = promiseConnection.connection;
            try {
                connection.beginTransaction();

                let result;

                if (stockChanged) {
                    result = await promiseConnection.execute(sql, [name, price, realStock, productId]);
                } else {
                    result = await promiseConnection.execute(sql, [name, price, productId]);
                }

                const affectedRows = result[0].affectedRows;

                if (affectedRows) {
                    // UPDATE product at Redis
                    const newProduct = {id: productId, name: name, price: price, stock: stock};
                    await this.redisClientService.jsonSet(`product:${productId}`, '.', JSON.stringify(newProduct));
                }

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

        return res.sendStatus(StatusCodes.OK);
    }
}

module.exports = ProductUpdateController;
