import "../styles/globals.css";
import Link from 'next/link';
import Head from "next/head";
import OpenMenu from "../public/openMenu.png";
import CloseMenu from "../public/closeMenu.png";
import Image from "next/image";
import { useState } from 'react'; 
import MenuScreen from "../components/menu.js";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }) {
	let [ menuOpen, setMenuOpen ] = useState(false);
	function toggleMenu(){
		menuOpen ? setMenuOpen(false) : setMenuOpen(true);
	}

	return (
		<SessionProvider session={pageProps.session}>
			<Head>
				<title>Community Project</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<nav>
				<div className="imageWrap" onClick={toggleMenu}>
					<Image src={menuOpen ? CloseMenu : OpenMenu} alt="menu button" layout="fill" objectFit="contain" objectPosition="25% 50%" />
				</div>
				<h1>Community Project</h1>
			</nav>
			{menuOpen ? <MenuScreen onLink={() => toggleMenu()} /> : <Component {...pageProps} />}
			<footer>
				<h2>Community Project</h2>
				<p><strong>© 2021, Samuel Fernandez</strong></p>
				<div>
					<h3>Library</h3>
					<div>
						<Link href="/library"><a className="link">The Library</a></Link>
					</div>
				</div>
				<div>
					<h3>Roadmaps</h3>
					<div>
						<Link href="/roadmaps"><a className="link">Roadmaps Home Page</a></Link><br />
						<Link href="/roadmaps/explore"><a className="link">Explore Roadmaps</a></Link><br />
						<Link href="/roadmaps/discover"><a className="link">Discover Roadmaps</a></Link>
					</div>
				</div>
				<div>
					<h3>Account</h3>
					<div>
						<Link href="/settings"><a className="link">Account Settings</a></Link><br />
						<Link href="/login"><a className="link">Login</a></Link><br />
						<Link href="/signup"><a className="link">Sign Up</a></Link>
					</div>
				</div>
			</footer>
		</SessionProvider>
	);
}

export default MyApp;
