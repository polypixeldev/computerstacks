const environmentVariables = [
	'GOOGLE_ID',
	'GOOGLE_SECRET',
	'GITHUB_ID',
	'GITHUB_SECRET',
	'EMAIL_SERVER',
	'EMAIL_FROM',
	'DATABASE_URL',
	'NODE_ENV',
	'JWT_SIGNING_PRIVATE_KEY',
	'NEXTAUTH_SECRET',
	'JWT_ENCRYPTION_KEY',
];

const prodEnvironmentVariables = ['SENTRY_DSN'];

function checkEnvironment() {
	if (process.env.NODE_ENV === 'test') {
		return [];
	}

	const missing = [];

	for (const variable of environmentVariables) {
		if (!process.env[variable]) {
			missing.push(variable);
		}
	}

	if (process.env.NODE_ENV === 'production') {
		for (const variable of prodEnvironmentVariables) {
			if (!process.env[variable]) {
				missing.push(variable);
			}
		}
	}

	return missing;
}

module.exports = checkEnvironment;
