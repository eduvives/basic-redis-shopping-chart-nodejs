const { StatusCodes } = require('http-status-codes');

class ProductUpdateController {
    constructor(redisClientService, dbMySQL) {
        this.redisClientService = redisClientService;
        this.dbMySQL = dbMySQL;
    }

    async index(req, res) {
        // Update -> atualizar detalles de los produtos en el catalogo y carritos
        const {
            session: { cartId },
            params: { id: productId, name: name, price: price, stock: stock }
        } = req;
        let { quantity, incrementBy } = req.body;
        let sql = 'UPDATE producto SET name = ?, price = ?, stock = ? WHERE id = ?'
        let productsMySQLtest;
        let query = await this.dbMySQL.query(sql, [productId, price, name, stock], function (err, result) {
            if (err) throw err;
            productsMySQLtest = JSON.parse(JSON.stringify(result));
        });
        // Actualizar en el redis
        const product = await this.redisClientService.jsonGet(productId);
        // Hacer los cambioss
        await this.redisClientService.jsonSet(`product:${productId}`, '.', 
        {name: name }, 
        {price: price},
        {stock: stock},
        {fechaDiscontinuidad: null}); // Cambiar

        return res.sendStatus(StatusCodes.OK);
    }
}

module.exports = ProductUpdateController;
