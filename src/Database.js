const mysql = require('mysql');

module.exports = class Database {
    constructor(host, user, password, database) {
        console.log({ host, user, password, database });
        this.connection = mysql.createConnection({ host, user, password, database });
    }

    static setInstance(instance) {
        Database.instance = instance;
    }

    static getInstance() {
        return Database.instance;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.connection.connect((err, res) => {
                if(err) return reject(err);
                
                return resolve(res);
            });
        });
    }

    async query(sql, values) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, values, (err, res) => {
                if(err) return reject(err);
                
                return resolve(res);
            });
        });
    }
};