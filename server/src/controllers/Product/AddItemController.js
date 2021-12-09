const { StatusCodes } = require('http-status-codes');

class ProductAddController {
    constructor(redisClientService, dbMySQL) {
        this.redisClientService = redisClientService;
        this.dbMySQL = dbMySQL;
    }

    async index(req, res) {
        // Set necessary parameters
        let { name, price, stock } = req.body;

        let sql;

        // INSERT para MySQL
        sql = 'INSERT INTO producto (name, price, stock) VALUES (?, ?, ?);'

        await this.dbMySQL.getConnection().then(async promiseConnection => {
            var connection = promiseConnection.connection;
            try {
                connection.beginTransaction();

                let result;

                result = await promiseConnection.execute(sql, [name, price, stock]);

                const affectedRows = result[0].affectedRows;

                if (affectedRows) {
                    // Add product at Redis
                    price = parseInt(price).toFixed(2)
                    const newProduct = {id: result[0].insertId, name: name, price: price, stock: stock};

                    await this.redisClientService.jsonSet(`product:${result[0].insertId}`, '.', JSON.stringify(newProduct));
                }

                connection.commit()
                console.info('Add successful');
            } catch (err) {
                console.error(`Error occurred while adding product: ${err.message}`, err);
                if (connection)  connection.rollback();
                console.info('Rollback successful');
            } finally {
                if (connection)  connection.release();
            }
        });

        return res.sendStatus(StatusCodes.OK);
    }
}

module.exports = ProductAddController;
