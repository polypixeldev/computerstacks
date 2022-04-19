import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			_id: string,
			favorites: string[],
			roadmaps: string[]
		} & DefaultSession["user"]
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		_id: string
	}
}