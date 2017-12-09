import path from 'path';

import {write, readdir, exists, mkdirs} from './util';

const timestamp = () => new Date().toISOString().substring(0, 23).replace(/[-:.T]/g, '');

export default async (command, options) => {
    // Load configuration file
    let config = require(path.join(process.cwd(), options.config));

    // Check if the configuration is an ES6 module
    if (config.default && typeof config.default === 'object') {
        config = config.default;
    }

    // Apply default configuration
    const {migrations = 'migrations', driver = 'rethinkdb', tableName = '_migrations', ...otherConfig} = config;

    // Create migrations folder if it doesn't exist
    const migrationsPath = path.join(process.cwd(), migrations);
    if (!(await exists(migrations, 'rw'))) {
        await mkdirs(migrationsPath);
    }

    // Create a new migration
    if (command === 'create') {
        const name = `${timestamp()}-${options.name || 'none'}.js`;
        await write(path.join(migrationsPath, name), 'TODO');

        console.log('Created new migration:', name);
        return;
    }

    // Handle up and down commands
    if (driver === 'rethinkdbdash') {
        try {
            if (otherConfig.cursor) {
                console.error('Please set cursor to false in your configuration');
                return;
            }

            // Initialize rethinkdbdash
            const r = require('rethinkdbdash')(otherConfig);

            // Create the migrations table if it doesn't exist
            const tables = await r.tableList().run();
            if (!tables.includes(tableName)) {
                await r.tableCreate(tableName).run();
                await r.table(tableName).insert({key: 'version', value: null}).run();
            }

            // Fetch the current migration
            const data = await r.table(tableName).filter({key: 'version'}).run();
            const migration = data.length === 0 ? null : data[0].value;

            // Read migrations
            const files = await readdir(migrationsPath);
            const versions = files.filter((file) => file.endsWith('.js')).map((file) => file.substring(0, file.length - 3)).sort().map((file) => ({
                key: file.split('-')[0],
                name: file.split('-').slice(1).join('-'),
                file
            }));

            switch (command) {
                case 'up': {
                    // Find the last migration
                    const startIndex = versions.findIndex((version) => version.key === migration);

                    if (startIndex < versions.length - 1) {
                        // Execute all outstanding migrations
                        for (let i = startIndex + 1; i < versions.length; i++) {
                            // TODO

                            console.log('Executed up migration', versions[i].key);
                        }

                        // Update the migration version
                        await r.table(tableName).filter({key: 'version'}).update({value: versions[versions.length -1].key}).run();
                    } else {
                        console.log('Database is up-to-date');
                    }

                    break;
                }
                case 'down': {
                    break;
                }
                case 'down-all': {
                    break;
                }
            }

            // Close all connections
            r.getPoolMaster().drain();
        } catch (err) {
            console.error(err);
            process.exit(0);
        }
    } else {
        // Initialize rethinkdb
        // TODO
    }
};
