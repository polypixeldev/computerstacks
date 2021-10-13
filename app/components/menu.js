import Link from "next/link";

function Menu({ onLink }) {
	return (
		<main>
			<section className="section1">
				<h2><Link href="/"><a className="link" onClick={onLink}>Home</a></Link></h2>
				<h2><Link href="/library"><a className="link" onClick={onLink}>Library</a></Link></h2>
				<h2><Link href="/roadmaps"><a className="link" onClick={onLink}>Roadmaps</a></Link></h2>
				<h2><Link href="/events"><a className="link" onClick={onLink}>Events</a></Link></h2>
				<h2><Link href="/settings"><a className="link" onClick={onLink}>Settings</a></Link></h2>
				<h2><Link href="/login"><a className="link" onClick={onLink}>Login</a></Link></h2>
				<h2><Link href="/signup"><a className="link" onClick={onLink}>Sign Up</a></Link></h2>
			</section>
		</main>
	)
}

export default Menu;