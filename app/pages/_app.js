import "../styles/globals.css";
import Link from "next/link";
import Head from "next/head";
import OpenMenu from "../public/openMenu.png";
import CloseMenu from "../public/closeMenu.png";
import SearchIcon from "../public/search.png";
import Image from "next/image";
import { useState } from "react";
import MenuScreen from "../components/menu.js";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
	const router = useRouter();

	let [menuOpen, setMenuOpen] = useState(false);
	let [query, setQuery] = useState("");

	function toggleMenu() {
		menuOpen ? setMenuOpen(false) : setMenuOpen(true);
	}

	function handleChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		if (name === "query") setQuery(value);
	}

	function handleSearch() {
		router.push(`/search?query=${query}`);
	}

	return (
		<SessionProvider session={pageProps.session}>
			<Head>
				<title>Community Project</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<nav>
				<div className="imageWrap" onClick={toggleMenu}>
					<Image
						src={menuOpen ? CloseMenu : OpenMenu}
						alt="menu button"
						layout="fill"
						objectFit="contain"
						objectPosition="25% 50%"
					/>
				</div>
				<div className="search">
					<input
						type="search"
						autoComplete="on"
						name="query"
						placeholder="Browse our collection"
						value={query}
						onChange={handleChange}
					/>
					<div>
						<div>
							<Image
								onClick={handleSearch}
								height={18}
								width={18}
								src={SearchIcon}
								alt="search"
								className="searchIcon"
							/>
						</div>
					</div>
				</div>
				<h1>Community Project</h1>
				<button
					className="button-small"
					id="signup"
					onClick={() => router.push("/signup")}
				>
					Sign Up
				</button>
				<button
					className="button-small"
					id="login"
					onClick={() => router.push("/login")}
				>
					Login
				</button>
			</nav>
			{menuOpen ? (
				<MenuScreen onLink={() => toggleMenu()} />
			) : (
				<Component {...pageProps} />
			)}
			<footer>
				<h2>Community Project</h2>
				<p>
					<strong>© 2021, Samuel Fernandez</strong>
				</p>
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
