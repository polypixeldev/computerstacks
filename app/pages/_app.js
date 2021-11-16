import "../styles/globals.css";
import Link from "next/link";
import Head from "next/head";
import { useState, useEffect } from "react";
import MenuScreen from "../components/menu.js";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";

function MyApp({ Component, pageProps }) {
	const router = useRouter();

	let [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		router.events.on("routeChangeStart", () => setMenuOpen(false));
		return () =>
			router.events.off("routeChangeStart", () => setMenuOpen(false));
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<SessionProvider session={pageProps.session}>
			<Head>
				<title>Community Project</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
			{menuOpen ? <MenuScreen /> : <Component {...pageProps} />}
			<footer>
				<div>
					<h2>Community Project</h2>
					<p>
						<strong>© 2021, Samuel Fernandez</strong>
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
						<br />
						<Link href="/signup">
							<a className="link">Sign Up</a>
						</Link>
					</div>
				</div>
			</footer>
		</SessionProvider>
	);
}

export default MyApp;
