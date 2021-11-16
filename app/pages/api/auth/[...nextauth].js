import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../db/prisma";
import bcrypt from "bcryptjs";

async function handler(req, res) {
	return await NextAuth(req, res, {
		providers: [
			GoogleProvider({
				clientId: process.env.GOOGLE_ID,
				clientSecret: process.env.GOOGLE_SECRET,
			}),
			GitHubProvider({
				clientId: process.env.GITHUB_ID,
				clientSecret: process.env.GITHUB_SECRET,
			}),
			EmailProvider({
				server: process.env.EMAIL_SERVER,
				from: process.env.EMAIL_FROM,
			}),
		],
		adapter: PrismaAdapter(prisma),
		session: {
			jwt: true,
		},
		pages: {
			signIn: "/login",
		},
		jwt: {
			signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
			encryption: true,
			encryptionKey: process.env.JWT_ENCRYPTION_KEY,
			secret: process.env.JWT_SECRET,
		},
		callbacks: {
			async jwt({ token, user }) {
				if (user) {
					token._id = user.id;
				}

				return token;
			},
			async session({ session, token }) {
				const dbUser = await prisma.user.findUnique({
					where: {
						id: token._id,
					},
					select: {
						favorites: true,
						roadmaps: true,
					},
				});

				session.user._id = token._id;
				session.user.favorites = dbUser.favorites;
				session.user.roadmaps = dbUser.roadmaps;

				return session;
			},
		},
		debug: false,
	});
}

export default handler;
