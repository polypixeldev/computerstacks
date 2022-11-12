import { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: number,
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