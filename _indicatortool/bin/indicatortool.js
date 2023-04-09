#!/usr/bin/env node

'use strict';

const minimist = require('minimist');
const indicatorTool = require('..');

// Uncaught error handler
process.on('uncaughtException', err => console.error(err.message || err));

// Parse arguments
const args = minimist(process.argv.slice(2), {
	boolean: ['subset', 'version', 'help'],
	alias: { s: 'subset', v: 'version', h: 'help' }
});

// CLI version query
if (args.vesion) {
	console.log('indicatortool');
	console.log('    Version ' + require('../package.json').version);
	process.exit(0);
}

// Validate es_systems argument
if (!args._[0]) {
	console.log('ERROR: missing es_systems argument');
	console.log();
	args.help = true;
}

// CLI help query
if (args.help) {
	console.log('  Usage');
	console.log('    indicatortool [options] <es_systems>');
	console.log();
	console.log('  Arguments');
	console.log('    es_systems        Path to es_systems XML file');
	console.log();
	console.log('  Options');
	console.log('    -s, --subset      Generate indicators for only a subset of systems');
	console.log('                          (comma separated list)');
	console.log('    -v, --version     Display version information');
	console.log('    -h, --help        Display help information');
	console.log();
	process.exit(0);
}

(async () => {
	// Invoke API
	try {
		await indicatorTool(args._[0], args);
	} catch (e) {
		console.error('ERROR:', e.message || e);
	}
})();
