import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Zilla_Slab, Open_Sans, Dosis } from '@next/font/google';
import { Analytics } from '@vercel/analytics/react';

import MenuScreen from '../components/menu';
import Navbar from '../components/navbar';
import { trpc } from '../util/trpc';

import '../styles/globals.css';

import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';

type PageProps = {
	session?: Session;
};

const zillaSlab = Zilla_Slab({
	weight: '400',
	subsets: ['latin'],
	variable: '--font-zilla-slab',
});
const openSans = Open_Sans({
	subsets: ['latin'],
	variable: '--font-open-sans',
});
const dosis = Dosis({
	weight: '300',
	subsets: ['latin'],
	variable: '--font-dosis',
});

function MyApp({ Component, pageProps }: AppProps<PageProps>) {
	return (
		<>
			<div
				className={`${zillaSlab.className} ${openSans.className} ${dosis.className} h-screen`}
			>
				<SessionProvider session={pageProps.session}>
					<Head>
						<title>ComputerStacks</title>
						<link rel="icon" href="/favicon.ico" />
					</Head>
					<Navbar />
					<Component {...pageProps} />
					<footer className="align-center flex h-min flex-row justify-evenly bg-gray-4 py-5 text-left font-zilla-slab text-2xl">
						<div>
							<h3 className="text-3xl">ComputerStacks</h3>
							<p>
								<strong>
									Made by{' '}
									<Link
										href="https://github.com/polypixeldev"
										className="underline"
									>
										polypixeldev
									</Link>
									,{' '}
									<Link
										href="https://github.com/polypixeldev/computerstacks/blob/main/LICENSE"
										className="underline"
									>
										licensed under GPL-3.0
									</Link>
								</strong>
							</p>
						</div>
						<div>
							<h3 className="text-3xl">Library</h3>
							<div>
								<Link href="/library">The Library</Link>
							</div>
						</div>
						<div>
							<h3 className="text-3xl">Roadmaps</h3>
							<div>
								<Link href="/roadmaps">Roadmaps Home Page</Link>
								<br />
								<Link href="/roadmaps/explore">Explore Roadmaps</Link>
								<br />
								<Link href="/roadmaps/discover">Discover Roadmaps</Link>
							</div>
						</div>
						<div>
							<h3 className="text-3xl">Account</h3>
							<div>
								<Link href="/settings">Account Settings</Link>
								<br />
								<Link href="/login">Login</Link>
							</div>
						</div>
					</footer>
				</SessionProvider>
			</div>
			<Analytics />
		</>
	);
}

export default trpc.withTRPC(MyApp);
