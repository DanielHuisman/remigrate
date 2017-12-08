import commandLineCommands from 'command-line-commands';
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';

const pkg = require('../package.json');

// Define command line commands
const commandDefinitions = [null, 'help', 'version', 'create', 'up', 'down', 'down-all'];

// Define command line options
const optionDefinitions = [{
    name: 'config',
    alias: 'c',
    type: String,
    description: 'Path of the configuration file'
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

// Parse command, options and usage definitions
const {command, argv} = commandLineCommands(commandDefinitions);
const options = commandLineArgs(optionDefinitions, argv);
const usage = commandLineUsage(usageDefinition);

switch (command) {
    case null:
    case 'help': {
        // Display usage information
        console.log(usage);

        // Exit after printing information
        process.exit(0);
        break;
    }
    case 'version': {
        // Display version information
        console.log(`remigrate - version ${pkg.version}`);

        // Exit after printing information
        process.exit(0);
    }
}

// TODO: start the actual tool
