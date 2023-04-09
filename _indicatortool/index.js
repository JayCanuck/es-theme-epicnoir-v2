const path = require('path');
const fs = require('fs-extra');
const { Parser } = require('xml2js');

const indicators = [
	'1st-system.png',
	'2nd-system.png',
	'3rd-system.png',
	'4th-system.png',
	'5th-system.png',
	'6th-system.png',
	'7th-system.png',
	'8th-system.png',
	'9th-system.png',
	'10th-system.png',
	'11th-system.png',
	'12th-system.png',
	'13th-system.png',
	'14th-system.png',
	'15th-system.png',
	'16th-system.png'
];

const api = async function (es_systems, { subset } = {}) {
	if (!fs.existsSync(es_systems)) throw new Error(`Failed to resolve target "${es_systems}"`);
	if (subset && !Array.isArray(subset)) subset = [subset];

	const data = await new Parser().parseStringPromise(
		fs.readFileSync(es_systems, { encoding: 'utf8' })
	);

	const sortKey = system =>
		system?.systemsortname?.[0] || system?.fullname?.[0] || system?.name?.[0];

	const systems = data.systemList.system
		.filter(system => !subset || subset.includes(system?.name?.[0]))
		.sort((a, b) => sortKey(a).localeCompare(sortKey(b)))
		.map(system => system?.name?.[0]);

	systems.forEach((system, i) => {
		const indicatorDir = path.resolve(path.join(__dirname, '..', '_assets', 'indicators'));
		const position = Math.ceil(((i + 1) / systems.length) * 16);

		fs.copySync(
			path.join(indicatorDir, indicators[position - 1]),
			path.join(indicatorDir, system + '.png')
		);
		console.log(`${indicators[position - 1]} >> ${system}.png`);
	});
};

// if run directly, execute CLI script
if (require.main === module) require('./bin/indicatortool');

module.exports = api;
