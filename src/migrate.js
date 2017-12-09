import path from 'path';

import * as drivers from './drivers';
import {read, write, readdir, exists, mkdirs} from './util';

const timestamp = () => new Date().toISOString().substring(0, 23).replace(/[-:.T]/g, '');

const loadMigration = (file) => {
    let migration = require(file);
    if (migration.default && typeof migration.default === 'object') {
        migration = migration.default;
    }
    return migration;
};

export default async (command, options) => {
    // Load configuration file
    let config = require(path.join(process.cwd(), options.config));

    // Check if the configuration is an ES6 module
    if (config.default && typeof config.default === 'object') {
        config = config.default;
    }

    // Apply default configuration
    const {migrations = 'migrations', template = 'es5', driver: driverName = 'rethinkdb', tableName = '_migrations', ...otherConfig} = config;

    // Create migrations folder if it doesn't exist
    const migrationsPath = path.join(process.cwd(), migrations);
    if (!(await exists(migrationsPath, 'rw'))) {
        await mkdirs(migrationsPath);
    }

    // Handle the create command
    if (command === 'create') {
        // Check if the template exists
        const templatePath = path.join(__dirname, '..', 'templates', `${template}.js`);
        if (!(await exists(templatePath))) {
            console.error('Unknown template:', template);
            return;
        }

        // Read the template
        const templateContent = await read(templatePath);

        // Create the new migration
        const name = `${timestamp()}-${options.name || 'none'}.js`;
        await write(path.join(migrationsPath, name), templateContent);

        console.log('Created new migration:', name);
        return;
    }

    if (!drivers[driverName]) {
        console.error('Unknown driver:', driverName);
        return;
    }

    try {
        // Configure the driver
        const driver = new drivers[driverName](tableName, otherConfig);

        // Create the migrations table if it doesn't exist
        await driver.initialize();

        // Fetch the current migration
        const data = await driver.getCurrentVersion();
        const migration = data.length === 0 ? null : data[0].value;

        // Read migrations
        const files = await readdir(migrationsPath);
        const versions = files.filter((file) => file.endsWith('.js')).map((file) => file.substring(0, file.length - 3)).sort().map((file) => ({
            key: file.split('-')[0],
            name: file.split('-').slice(1).join('-'),
            file: `${file}.js`
        }));

        // Find the last migration
        const startIndex = versions.findIndex((version) => version.key === migration);

        switch (command) {
            case 'status': {
                if (startIndex === -1) {
                    console.log('Database has no migrations');
                } else {
                    console.log('Database is currently at migration', versions[startIndex].key, versions[startIndex].name);
                }

                const count = startIndex === -1 ? versions.length : versions.length - startIndex - 1;
                console.log(count.toString(), count === 1 ? 'migration' : 'migrations', 'can be executed');
                break;
            }
            case 'up': {
                if (startIndex < versions.length - 1) {
                    // Execute all outstanding migrations
                    let latest = startIndex;
                    for (let i = startIndex + 1; i < versions.length; i++) {
                        try {
                            const version = loadMigration(path.join(migrationsPath, versions[i].file));
                            if (!version.up || typeof version.up !== 'function') {
                                console.error('Migration has no up function:', versions[i].key, versions[i].name);
                                break;
                            }

                            // Execute the migration
                            await version.up(...driver.getArguments());

                            console.log('Executed up migration', versions[i].key, versions[i].name);
                            latest = i;
                        } catch (err) {
                            console.error(err);
                        }
                    }

                    // Update the migration version
                    await driver.updateVersion(versions[latest].key);
                } else {
                    console.log('Database is up-to-date');
                }
                break;
            }
            case 'down': {
                if (startIndex !== -1) {
                    // Execute one down migration
                    try {
                        const version = loadMigration(path.join(migrationsPath, versions[startIndex].file));
                        if (!version.down || typeof version.down !== 'function') {
                            console.error('Migration has no down function:', versions[startIndex].key, versions[startIndex].name);
                            break;
                        }

                        // Execute the migration
                        await version.down(...driver.getArguments());

                        console.log('Exectued down migration', versions[startIndex].key, versions[startIndex].name);

                        // Update the migration version
                        await driver.updateVersion(startIndex === 0 ? null : versions[startIndex - 1].key);
                    } catch (err) {
                        console.error(err);
                    }
                } else {
                    console.log('Database has no migrations left');
                }
                break;
            }
            case 'down-all': {
                if (startIndex !== -1) {
                    // Execute all down migrations
                    let latest = startIndex;
                    for (let i = startIndex; i >= 0; i--) {
                        try {
                            const version = loadMigration(path.join(migrationsPath, versions[i].file));
                            if (!version.down || typeof version.down !== 'function') {
                                console.error('Migration has no down function:', versions[i].key, versions[i].name);
                                break;
                            }

                            // Execute the migration
                            await version.down(...driver.getArguments());

                            console.log('Executed down migration', versions[i].key, versions[i].name);
                            latest = i;
                        } catch (err) {
                            console.error(err);
                        }
                    }

                    // Update the migration version
                    await driver.updateVersion(latest === 0 ? null : latest - 1);
                } else {
                    console.log('Database has no migrations left');
                }
                break;
            }
        }

        // Close the driver's conenction
        driver.close();
    } catch (err) {
        console.error(err);
        process.exit(0);
    }
};
