import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';

import MenuScreen from '../components/menu';
import Navbar from '../components/navbar';

import '../styles/globals.css';

import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();

	let [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		router.events.on('routeChangeStart', () => setMenuOpen(false));
		return () =>
			router.events.off('routeChangeStart', () => setMenuOpen(false));
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		const interceptor = axios.interceptors.response.use(
			(res) => res,
			(err) => {
				console.log(err);

				if (typeof window !== 'undefined') {
					alert(
						`An unexpected error occurred, please try again later. If the issue persists, file an issue on https://github.com/Poly-Pixel/computerstacks \n ${err}`
					);
				}

				return err;
			}
		);

		return () => axios.interceptors.response.eject(interceptor);
	}, []);

	return (
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
							<Link href="https://github.com/Poly-Pixel">
								<a className="link-underline">Poly-Pixel</a>
							</Link>
							,{' '}
							<Link href="https://github.com/Poly-Pixel/computerstacks/blob/main/LICENSE">
								<a className="link-underline">licensed under GPL-3.0</a>
							</Link>
						</strong>
					</p>
					<p>
						Favicon &ldquo;Computer&rdquo; by Erin Standley from NounProject.com
					</p>
				</div>
				<div>
					<h3>Library</h3>
					<div>
						<Link href="/library">
							<a className="link">The Library</a>
						</Link>
					</div>
				</div>
				<div>
					<h3>Roadmaps</h3>
					<div>
						<Link href="/roadmaps">
							<a className="link">Roadmaps Home Page</a>
						</Link>
						<br />
						<Link href="/roadmaps/explore">
							<a className="link">Explore Roadmaps</a>
						</Link>
						<br />
						<Link href="/roadmaps/discover">
							<a className="link">Discover Roadmaps</a>
						</Link>
					</div>
				</div>
				<div>
					<h3>Account</h3>
					<div>
						<Link href="/settings">
							<a className="link">Account Settings</a>
						</Link>
						<br />
						<Link href="/login">
							<a className="link">Login</a>
						</Link>
					</div>
				</div>
			</footer>
		</SessionProvider>
	);
}

export default MyApp;
