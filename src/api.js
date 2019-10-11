const express = require('express');
const Database = require('./Database');
const InventoryController = require('./Controllers/InventoryController');
require('dotenv').config();

const app = express();

(async() => {
    await setupDependencies();
    app.use(express.json());
    setupRoutes();
    app.listen(process.env.API_PORT);
    console.log(`Server started, listening on  http://localhost:${process.env.API_PORT}`);
})();

function setupRoutes() {
    // inventory
    app.get('/players/:playerId/inventory', InventoryController.all);
    app.post('/players/:playerId/inventory', InventoryController.add);
    app.delete('/players/:playerId/inventory/:id', InventoryController.del);

}

async function setupDependencies() {
    try {
        const dbInstance = new Database(process.env.MYSQL_HOST, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, process.env.MYSQL_DATABASE);
        await dbInstance.connect();
        Database.setInstance(dbInstance);
        console.log('Database setup ok');
    } catch (e) {
        console.log(e);
        console.log('Failed to set up dependencies');
        process.exit(1);
    }
}