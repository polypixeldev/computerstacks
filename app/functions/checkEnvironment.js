const environmentVariables = ["NEXTAUTH_URL", "GOOGLE_ID", "GOOGLE_SECRET", "GITHUB_ID", "GITHUB_SECRET", "EMAIL_SERVER", "EMAIL_FROM", "MONGODB_URI", "NODE_ENV", "JWT_SIGNING_PRIVATE_KEY", "NEXTAUTH_SECRET", "JWT_ENCRYPTION_KEY", "SENTRY_DSN"];

function checkEnvironment() {
	const missing = [];

	for (const variable of environmentVariables) {
		if (!process.env[variable]) {
			missing.push(variable);
		}
	}

	return missing;
}

module.exports = checkEnvironment;