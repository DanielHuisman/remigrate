export default class Rethinkdbdash {
    constructor(tableName, options) {
        this.tableName = tableName;
        this.options = options;
        this.r = require('rethinkdb');
    }

    run = async (command, cursor = true) => {
        try {
            const result = await command.run(this.connection);
            if (cursor) {
                return await result.toArray();
            }
            return result;
        } catch (err) {
            throw err;
        }
    }

    initialize = async () => {
        try {
            this.connection = await this.r.connect(this.options);

            // Create the migrations table if it doesn't exist
            const tables = await this.run(this.r.tableList());
            if (!tables.includes(this.tableName)) {
                await this.run(this.r.tableCreate(this.tableName), false);
                await this.run(this.r.table(this.tableName).insert({key: 'version', value: null}));
            }
        } catch (err) {
            throw err;
        }
    }

    getArguments() {
        return [this.r, this.connection, this.run];
    }

    getCurrentVersion = async () => {
        try {
            return await this.run(this.r.table(this.tableName).filter({key: 'version'}));
        } catch (err) {
            throw err;
        }
    }

    updateVersion = async (value) => {
        try {
            await this.run(this.r.table(this.tableName).filter({key: 'version'}).update({value}), false);
        } catch (err) {
            throw err;
        }
    }

    close = async () => {
        try {
            await this.connection.close();
        } catch (err) {
            throw err;
        }
    }
};
