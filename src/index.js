import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';

const pkg = require('../package.json');

// Define command line options
const optionDefinitions = [{
    name: 'help',
    alias: 'H',
    type: Boolean,
    description: 'Display usage information.'
}, {
    name: 'version',
    alias: 'v',
    type: Boolean,
    description: 'Display version information.'
}];

// Define command line usage
const usageDefinition = [{
    header: 'remigrate',
    content: 'RethinkDB migrations.'
}, {
    header: 'Options',
    optionList: optionDefinitions
}];

// Parse options and usage definitions
const options = commandLineArgs(optionDefinitions);
const usage = commandLineUsage(usageDefinition);

if (options.help) {
    // Display usage information
    console.log(usage);

    // Exit after printing information
    process.exit(0);
} else if (options.version) {
    // Display version information
    console.log(`remigrate - version ${pkg.version}`);

    // Exit after printing information
    process.exit(0);
}

// TODO: start the actual tool
