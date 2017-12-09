export default class Rethinkdbdash {
    constructor(tableName, options) {
        this.tableName = tableName;
        this.options = options;
        this.r = require('rethinkdb');
    }

    initialize = async () => {
        try {
            this.connection = await this.r.connect(this.options);
        } catch (err) {
            throw err;
        }
    }

    getArguments() {
        return [this.r, this.connection];
    }

    getCurrentVersion = async () => {
        return null;
    }

    updateVersion = async (value) => {

    }

    close = async () => {
        try {
            await this.connection.close();
        } catch (err) {
            throw err;
        }
    }
};
