import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Zilla_Slab, Open_Sans, Dosis } from '@next/font/google';

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
	const router = useRouter();

	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		router.events.on('routeChangeStart', () => setMenuOpen(false));
		return () =>
			router.events.off('routeChangeStart', () => setMenuOpen(false));
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div
			className={`${zillaSlab.className} ${openSans.className} ${dosis.className}`}
		>
			<SessionProvider session={pageProps.session}>
				<Head>
					<title>ComputerStacks</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
				{menuOpen ? <MenuScreen /> : <Component {...pageProps} />}
				<footer>
					<div>
						<h2>ComputerStacks</h2>
						<p>
							<strong>
								Made by{' '}
								<Link
									href="https://github.com/Poly-Pixel"
									className="link-underline"
								>
									Poly-Pixel
								</Link>
								,{' '}
								<Link
									href="https://github.com/Poly-Pixel/computerstacks/blob/main/LICENSE"
									className="link-underline"
								>
									licensed under GPL-3.0
								</Link>
							</strong>
						</p>
						<p>
							Favicon &ldquo;Computer&rdquo; by Erin Standley from
							NounProject.com
						</p>
					</div>
					<div>
						<h3>Library</h3>
						<div>
							<Link href="/library" className="link">
								The Library
							</Link>
						</div>
					</div>
					<div>
						<h3>Roadmaps</h3>
						<div>
							<Link href="/roadmaps" className="link">
								Roadmaps Home Page
							</Link>
							<br />
							<Link href="/roadmaps/explore" className="link">
								Explore Roadmaps
							</Link>
							<br />
							<Link href="/roadmaps/discover" className="link">
								Discover Roadmaps
							</Link>
						</div>
					</div>
					<div>
						<h3>Account</h3>
						<div>
							<Link href="/settings" className="link">
								Account Settings
							</Link>
							<br />
							<Link href="/login" className="link">
								Login
							</Link>
						</div>
					</div>
				</footer>
			</SessionProvider>
		</div>
	);
}

export default trpc.withTRPC(MyApp);
// THE CULPRIT!!!!
