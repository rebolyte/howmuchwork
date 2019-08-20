const { writeFileSync } = require('fs');
const path = require('path');

const { envs } = require('./constants');
const LOCAL_DEV_CONFIG = require('../config/local-dev-config');
const PROD_CONFIG = require('../config/prod-config');

const getParameters = env => {
	switch (env) {
		case envs.DEV:
			return LOCAL_DEV_CONFIG;
			break;
		case envs.PROD:
			// could call out to AWS Parameter Store or similar here
			return PROD_CONFIG;
			break;
		default:
			throw new Error('unknown env provided');
	}
};

const getConfig = env => {
	const config = getParameters(env);
	const out = JSON.stringify(config, null, 2);

	writeFileSync(path.join(__dirname, '..', '.env.json'), out);
};

module.exports = getConfig;
