import "../styles/globals.css";
import Head from "next/head";
import MenuButton from "../public/menuButton.png";
import Image from "next/image";

function MyApp({ Component, pageProps }) {
	return (
		<div>
			<Head>
				<title>Community Project</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<nav>
				<div className="imageWrap">
					<Image src={MenuButton} alt="menu button" layout="fill" objectFit="contain" objectPosition="25% 50%" />
				</div>
				<h1>Community Project</h1>
			</nav>
			<Component {...pageProps} />
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
		</div>
	);
}

export default MyApp;
