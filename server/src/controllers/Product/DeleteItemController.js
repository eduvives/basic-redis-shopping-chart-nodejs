const { StatusCodes } = require('http-status-codes');

class ProductDeleteItemController {
    constructor(redisClientService, dbMySQL) {
        this.redisClientService = redisClientService;
        this.dbMySQL = dbMySQL;
    }

    async index(req, res) {
        // TODO
        // Deletar en las 2 o ninguna, (y mirar si se actualiza los carritos)
        const { cartId } = req.session;
        const { id: productId } = req.params;
         
        let productInStore = await this.redisClientService.jsonGet(`product:${productId}`);
        let fecha = productInStore.fechaDiscontinuidad;

        // UPDATE para MySQL
        let affectedRows;
        let sql = 'UPDATE producto SET fechaDiscontinuidad = ? WHERE id = ?'
        let productsMySQLtest;
        let query = await this.dbMySQL.query(sql, [fecha, productId], function (err, result) {
            if (err) throw err;
            productsMySQLtest = JSON.parse(JSON.stringify(result));
            // console.log(productsMySQLtest)
            affectedRows = productsMySQLtest.affectedRows;
            console.log("affectedRows:", affectedRows);
        });
        // DELETE key de product para redis
        const keysDeleted = await this.redisClientService.del(`product:${productId}`);

        // Deletar product de todos los carts
        const cartKeys = await this.redisClientService.scan('cart:*');
        for (const key of cartKeys) {
            await this.redisClientService.hdel(`cart:${key}`, `product:${productId}`);
        }
        // Falta actualizar en el front 
        // Falta hacer el refresh
        return res.sendStatus(StatusCodes.NO_CONTENT);
    }
}

module.exports = ProductDeleteItemController;
