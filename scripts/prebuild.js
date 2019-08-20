const { execSync } = require('child_process');

const { branches, envs } = require('./constants');
const getConfig = require('./get-config');

const args = process.argv.slice(2);

const env = args[1];

if (!Object.values(envs).includes(env)) {
	console.log(
		`Invalid environment! Value ${env} is not one of ${JSON.stringify(Object.values(envs))}`
	);
	process.exit(1);
}

let isInRepo = false;
try {
	isInRepo =
		execSync('git rev-parse --is-inside-work-tree')
			.toString()
			.trim() === 'true';
} catch (err) {}

// prettier-ignore
if (isInRepo && (env === envs.PROD)) {
	console.log(`Production build - ensuring git branch is ${branches.DEVELOP}`);
	const currentBranch = execSync('git rev-parse --abbrev-ref HEAD')
		.toString()
		.trim();
	if (currentBranch !== branches.DEVELOP) {
		console.log(`The branch is not ${branches.DEVELOP}`);
		process.exit(1);
	}
}

// if (isInRepo && env !== envs.DEV) {
// 	console.log('Ensuring git status is clean');
// 	const ensureGitStatusClean = execSync('git status --porcelain')
// 		.toString()
// 		.trim();
// 	if (ensureGitStatusClean.length !== 0) {
// 		console.log('Please stash or reset your changes');
// 		process.exit(1);
// 	}
// }

console.log(`Getting ${env} config`);

getConfig(env);
