import NextAuth from 'next-auth';
import nodemailer from 'nodemailer';
import { withSentry } from "@sentry/nextjs";
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import prisma from '../../../db/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const adapter = PrismaAdapter(prisma);

	return await NextAuth(req, res, {
		providers: [
			GoogleProvider({
				clientId: process.env.GOOGLE_ID ?? '',
				clientSecret: process.env.GOOGLE_SECRET ?? '',
			}),
			GitHubProvider({
				clientId: process.env.GITHUB_ID ?? '',
				clientSecret: process.env.GITHUB_SECRET ?? '',
			}),
			EmailProvider({
				server: process.env.EMAIL_SERVER,
				from: process.env.EMAIL_FROM,
				async sendVerificationRequest({ identifier: email, url}) {
					const transport = nodemailer.createTransport(process.env.EMAIL_SERVER)
					await transport.sendMail({
					  to: email,
					  from: process.env.EMAIL_FROM,
					  subject: `Sign in to ComputerStacks`,
					  text: 'Sign in to ComputerStacks',
					  html: html({ url, email }),
					})
				}
			}),
		],
		adapter: adapter,
		session: {
			strategy: 'jwt',
		},
		pages: {
			signIn: '/login',
			verifyRequest: '/checkemail'
		},
		secret: process.env.NEXTAUTH_SECRET,
		callbacks: {
			async jwt({ token, user, isNewUser }) {
				if (user) {
					token._id = user.id;
				}

				if (isNewUser && user) {
					await prisma.user.update({
						where: {
							id: user.id,
						},
						data: {
							favorites: [],
							roadmaps: [],
						},
					});

					if (!user.email) {
						await prisma.user.update({
							where: {
								id: user.id,
							},
							data: {
								email: null,
							},
						});
					}
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

				if (!dbUser) {
					throw new Error("Unable to fetch session user document");
				}

				session.user._id = token._id;
				session.user.favorites = dbUser.favorites;
				session.user.roadmaps = dbUser.roadmaps;

				return session;
			},
		},
		debug: false,
	});
}

function html({ url, email }: { url: string, email: string}) {
	// Insert invisible space into domains and email address to prevent both the
	// email address and the domain from being turned into a hyperlink by email
	// clients like Outlook and Apple mail, as this is confusing because it seems
	// like they are supposed to click on their email address to sign in.
	const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`

	const backgroundColor = "#454554"
	const textColor = "#ffffff"
	const mainBackgroundColor = "#4c4c63"
	const buttonBackgroundColor = "#346df1"
	const buttonBorderColor = "#346df1"
	const buttonTextColor = "#ffffff"

	return `
		<body style="background: ${backgroundColor};">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
				<tr>
				<td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
					<strong>ComputerStacks</strong>
				</td>
				</tr>
			</table>
			<table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
				<tr>
				<td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
					Sign in as <strong>${escapedEmail}</strong>
				</td>
				</tr>
				<tr>
				<td align="center" style="padding: 20px 0;">
					<table border="0" cellspacing="0" cellpadding="0">
					<tr>
						<td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Sign in</a></td>
					</tr>
					</table>
				</td>
				</tr>
				<tr>
				<td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
					If you did not request this email you can safely ignore it.
				</td>
				</tr>
			</table>
		</body>
	`
}

export default withSentry(handler);
