import { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string,
			favoriteCategories: string[],
			favoriteResources: string[],
			roadmaps: string[]
		} & DefaultSession["user"]
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string
	}
}