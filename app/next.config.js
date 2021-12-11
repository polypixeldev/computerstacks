module.exports = {
	reactStrictMode: true,
	images: {
		domains: [
			'lh3.googleusercontent.com',
			'avatars.githubusercontent.com',
			'raw.githubusercontent.com',
			'roadmap.sh',
		],
	},
	env: {
		NEXTAUTH_URL: process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: `http://localhost`,
	},
};
