import Link from "next/link";

function Menu() {
	return (
		<main>
			<section className="section1">
				<h2><Link href="/"><a className="link">Home</a></Link></h2>
				<h2><Link href="/"><a className="link">Library</a></Link></h2>
				<h2><Link href="/"><a className="link">Roadmaps</a></Link></h2>
				<h2><Link href="/"><a className="link">Events</a></Link></h2>
				<h2><Link href="/"><a className="link">Settings</a></Link></h2>
				<h2><Link href="/"><a className="link">Login</a></Link></h2>
				<h2><Link href="/"><a className="link">Sign Up</a></Link></h2>
			</section>
		</main>
	)
}

export default Menu;