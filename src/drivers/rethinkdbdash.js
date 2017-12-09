export default class Rethinkdbdash {
    constructor(tableName, options) {
        if (options.cursor) {
            throw new Error('Please set cursor to false in your configuration');
        }

        this.tableName = tableName;
        this.r = require('rethinkdbdash')(options);
    }

    initialize = async () => {
        try {
            // Create the migrations table if it doesn't exist
            const tables = await this.r.tableList().run();
            if (!tables.includes(this.tableName)) {
                await this.r.tableCreate(this.tableName).run();
                await this.r.table(this.tableName).insert({key: 'version', value: null}).run();
            }
        } catch (err) {
            throw err;
        }
    }

    getCurrentVersion = async () => {
        try {
            return await this.r.table(this.tableName).filter({key: 'version'}).run();
        } catch (err) {
            throw err;
        }
    }

    updateVersion = async (value) => {
        try {
            await this.r.table(this.tableName).filter({key: 'version'}).update({value}).run();
        } catch (err) {
            throw err;
        }
    }

    close = async () => {
        try {
            await this.r.getPoolMaster().drain();
        } catch (err) {
            throw err;
        }
    }
};
