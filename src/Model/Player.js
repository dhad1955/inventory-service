const Database = require('../Database');

class Player {
    constructor(playerData) {
        this.data = playerData;
        this.inventory = new Inventory(this);
    }

    getInventory() {
        return this.inventory;
    }
}

const MAX_AMOUNT = 50;

class Inventory {
    constructor(player) {
        this.player = player;
    }

    async addItem(itemId, amount) {
        const item = await Database.getInstance().query('SELECT * FROM items where id = ?', [itemId]);
        if (!item.length) {
            throw new Error(`Item not found with id ${itemId}`);
        }

        if(amount < 0) {
            throw new Error('Amount cannot be negative');
        }

        const existingItem = await Database.getInstance().query('SELECT * FROM inventory_items WHERE item_id = ? AND player_id = ?', [itemId, this.player.data.id]);

        let maxAmount = MAX_AMOUNT;
        let amountToAdd = amount;
        const hasExisting = existingItem.length;
        let existingAmount = 0;

        if (hasExisting) {
            const existing = existingItem[0];
            existingAmount = existing.amount;
            maxAmount = MAX_AMOUNT - existingAmount;
        }

        if(maxAmount <= 0) {
            return {
                addedAmount: 0,
                total: existingAmount
            };
        }

        if (amount > maxAmount) {
            amountToAdd = maxAmount;
        }

        existingAmount += amountToAdd;

        if (hasExisting) {
            await Database.getInstance().query('UPDATE inventory_items SET amount = ? WHERE id = ?', [existingAmount, existingItem[0].id]);
        } else {
            await Database.getInstance().query('INSERT into inventory_items (id, player_id, item_id, amount) VALUES(NULL, ?, ?, ?)', [this.player.data.id, itemId, amountToAdd]);
        }

        return {
            addedAmount: amountToAdd,
            total: existingAmount
        };
    }

    async removeItem(id, amount) {
        const item = await Database.getInstance().query('SELECT * FROM inventory_items WHERE id = ? and player_id = ?', [id, this.player.data.id]);
        if(!item.length) {
            throw new Error('Player does not have an item with this id');
        }

        if(amount < 0) {
            throw new Error('Amount cannot be negative');
        }

        const existing = item[0];

        const existingAmount = existing.amount;

        existing.amount -= amount;

        if(existing.amount <= 0) {
            await Database.getInstance().query('DELETE FROM inventory_items WHERE id = ?', [id]);
            
            return {
                total: 0,
                removedAmount: existingAmount
            };
        }

        await Database.getInstance().query('UPDATE inventory_items SET amount = ? WHERE id = ?', [existing.amount, id]);
        
        return {
            total: existing.amount,
            removedAmount: existingAmount - existing.amount
        };
    }

    async getItems() {
        return await Database.getInstance().query('SELECT * FROM inventory_items WHERE player_id = ?', [this.player.data.id]);
    }
}

module.exports = Player;