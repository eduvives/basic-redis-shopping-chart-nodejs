const { StatusCodes } = require('http-status-codes');

class ProductDeleteItemController {
    constructor(redisClientService, dbMySQL) {
        this.redisClientService = redisClientService;
        this.dbMySQL = dbMySQL;
    }

    async index(req, res) {

        // TODO

        /*
        const { cartId } = req.session;
        const { id: productId } = req.params;

        const quantityInCart =
            parseInt(await this.redisClientService.hget(`cart:${cartId}`, `product:${productId}`)) || 0;

        if (quantityInCart) {
            await this.redisClientService.hdel(`cart:${cartId}`, `product:${productId}`);

            let productInStore = await this.redisClientService.jsonGet(`product:${productId}`);

            productInStore = JSON.parse(productInStore);
            productInStore.stock += quantityInCart;

            await this.redisClientService.jsonSet(`product:${productId}`, '.', JSON.stringify(productInStore));
        }
         */

        return res.sendStatus(StatusCodes.NO_CONTENT);
    }
}

module.exports = ProductDeleteItemController;
