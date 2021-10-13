import "../styles/globals.css";
import Head from "next/head";
import OpenMenu from "../public/openMenu.png";
import CloseMenu from "../public/closeMenu.png";
import Image from "next/image";
import { useState } from 'react'; 
import MenuScreen from "../components/menu.js";

function MyApp({ Component, pageProps }) {
	let [ menuOpen, setMenuOpen ] = useState(false);
	function toggleMenu(){
		menuOpen ? setMenuOpen(false) : setMenuOpen(true);
	}

	return (
		<>
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
					<h3>Category</h3>
					<div>
						<p>Link</p>
						<p>Link</p>
						<p>Link</p>
					</div>
				</div>
			</footer>
		</>
	);
}

export default MyApp;
