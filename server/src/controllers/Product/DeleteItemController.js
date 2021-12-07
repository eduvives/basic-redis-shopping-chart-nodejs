const { StatusCodes } = require('http-status-codes');
const mysql = require('mysql2/promise');

class ProductDeleteItemController {
    constructor(redisClientService, dbMySQL) {
        this.redisClientService = redisClientService;
        this.dbMySQL = dbMySQL;
    }

    async index(req, res) {
        // Atomic CRUD Operation (deletion)

        const { id: productId } = req.params;

        let productInStore =  this.redisClientService.jsonGet(`product:${productId}`);
        let fecha = new Date();

        // UPDATE para MySQL
        let sql = 'UPDATE producto SET fechaDiscontinuidad = ? WHERE id = ?'

        await this.dbMySQL.getConnection().then(async promiseConnection => {
            var connection = promiseConnection.connection;
            try {
                 connection.beginTransaction();

                const result = await promiseConnection.execute(sql, [fecha, productId]);
                const affectedRows = result[0].affectedRows;

                if (affectedRows) {
                    // DELETE product key in Redis
                    console.log(productId)
                    const keysDeleted = await this.redisClientService.del(`product:${productId}`);

                    // Delete product from all the carts
                    const cartKeys = await this.redisClientService.scan('cart:*');
                    console.log(cartKeys)
                    for (const key of cartKeys) {
                        const quantityInCart =
                            parseInt(await this.redisClientService.hget(key, `product:${productId}`)) || 0;

                        if (quantityInCart) {
                            await this.redisClientService.hdel(key, `product:${productId}`);

                        }
                    }
                }

                connection.commit()
                console.info('Delete successful');

            } catch (err) {
                console.error(`Error occurred while deleting product: ${err.message}`, err);
                if (connection)  connection.rollback();
                console.info('Rollback successful');
            } finally {
                if (connection)  connection.release();
            }
        });

        return res.sendStatus(StatusCodes.NO_CONTENT);
    }
}

module.exports = ProductDeleteItemController;
