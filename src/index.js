import commandLineCommands from 'command-line-commands';
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';

import migrate from './migrate';

const pkg = require('../package.json');

// Define command line commands
const commandDefinitions = [null, 'help', 'version', 'create', 'up', 'down', 'down-all'];

// Define command line options
const optionDefinitions = [{
    name: 'config',
    alias: 'c',
    type: String,
    description: 'Path of the configuration file'
}, {
    name: 'name',
    type: String,
    defaultOption: true,
    description: 'Name of the migration to create'
}];

// Define command line usage
const usageDefinition = [{
    header: 'remigrate',
    content: 'RethinkDB migrations.'
}, {
    header: 'Synopsis',
    content: 'remigrate <options> <command>'
}, {
    header: 'Commands',
    content: [
        {name: 'create', summary: 'Create a new migration'},
        {name: 'up', summary: 'Run all outstanding up migrations'},
        {name: 'down', summary: 'Run one down migration'},
        {name: 'down-all', summary: 'Run all down migrations'}
    ]
}, {
    header: 'Options',
    optionList: optionDefinitions
}];

// Reorder commands and options (commands before options)
const args = process.argv.slice(2);
const argCommands = [];
const argOptions = [];
for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('-')) {
        argOptions.push(args[i]);
        argOptions.push(args[i + 1]);
        i++;
    } else {
        argCommands.push(args[i]);
    }
}
const finalArgs = argCommands.concat(argOptions);

// Parse command, options and usage definitions
const {command, argv} = commandLineCommands(commandDefinitions, finalArgs);
const options = commandLineArgs(optionDefinitions, {argv});
const usage = commandLineUsage(usageDefinition);

// Handle basic commands
switch (command) {
    case null:
    case 'help': {
        // Display usage information
        console.log(usage);
        process.exit(0);
        break;
    }
    case 'version': {
        // Display version information
        console.log(`remigrate - version ${pkg.version}`);
        process.exit(0);
        break;
    }
}

// Validate options
if (!options.config) {
    console.error('No configuration file specified');
    process.exit(0);
}

// Execute the migration command
migrate(command, options);
