const Database = require('../Database');
const Player = require('../Model/Player');
const Redlock = require('../RedLock');

const _getPlayer = async function(playerId) {

    const result = await Database.getInstance()
        .query('SELECT * FROM players WHERE id = ? ', [playerId]);

    if (!result.length) {
        return null;
    }
    
    return new Player(result[0]);
};

/* Delete an item from a users inventory */
const del =  async function(request, res, next) {
    if (isNaN(request.params.playerId)) {
        res.status(400);
        
        return res.json({
            message: 'Malformed input'
        });
    }

    // lock the inventory resource
    const lock = await Redlock.lock(`lock:players:${request.params.playerId}:inventory`, 3000);

    let player = await _getPlayer(request.params.playerId);

    if (!player) {
        res.status(404);
        await lock.unlock();
        
        return res.json({
            message: 'Player not found'
        });
    }

    if (isNaN(parseInt(request.body.amount))) {
        res.status(400);
        await lock.unlock();
        
        return res.json({
            message: 'Malformed input'
        });
    }

    try {
        let result = await player.getInventory().removeItem(request.params.id, request.body.amount);
        await lock.unlock();
        
        return res.json(result);
    } catch (error) {
        res.status(400);
        await lock.unlock();
        
        return res.json({
            message: error.message
        });
    }
};

/* Add an item to a users inventory */

const add = async function(request, res, next) {

    if (isNaN(request.params.playerId)) {
        res.status(400);
        
        return res.json({
            message: 'Malformed input'
        });
    }
    // lock the inventory resource
    const lock = await Redlock.lock(`lock:players:${request.params.playerId}:inventory`, 3000);

    let player = await _getPlayer(request.params.playerId);

    if (!player) {
        res.status(404);
        await lock.unlock();
        
        return res.json({
            message: 'Player not found'
        });
    }

    if (isNaN(parseInt(request.body.itemId))) {
        res.status(400);
        await lock.unlock();
        
        return res.json({
            message: 'Malformed input'
        });
    }

    if (isNaN(parseInt(request.body.amount))) {
        res.status(400);
        await lock.unlock();
        
        return res.json({
            message: 'Malformed input'
        });
    }

    try {
        const result = await player.getInventory().addItem(request.body.itemId, request.body.amount);
        await lock.unlock();
        
        return res.json(result);
    } catch (error) {
        res.status(400);
        await lock.unlock();
        
        return res.json({
            message: error.message
        });
    }
};

/* Request all items in a users inventory */

const all = async function(request, res, next) {

    if (isNaN(request.params.playerId)) {
        res.status(400);
        
        return res.json({
            message: 'Malformed input'
        });
    }

    // lock the inventory resource
    const lock = await Redlock.lock(`lock:players:${request.params.playerId}:inventory`, 3000);

    let player = await _getPlayer(request.params.playerId);

    if (!player) {
        res.status(404);
        await lock.unlock();
        
        return res.json({
            message: 'Player not found'
        });
    }

    const result = await player.getInventory().getItems();
    await lock.unlock();

    return res.json(result);
};

module.exports = { add, all, del };
