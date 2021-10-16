import Link from "next/link";
import { useSession } from 'next-auth/react';

function Menu({ onLink }) {
	const { data: session, status } = useSession()

	return (
		<main>
			<section className="section1">
				<h2><Link href="/"><a className="link" onClick={onLink}>Home</a></Link></h2>
				<h2><Link href="/library"><a className="link" onClick={onLink}>Library</a></Link></h2>
				<h2><Link href="/roadmaps"><a className="link" onClick={onLink}>Roadmaps</a></Link></h2>
				<h2><Link href="/events"><a className="link" onClick={onLink}>Events</a></Link></h2>
				<h2><Link href="/settings"><a className="link" onClick={onLink}>Settings</a></Link></h2>
				<h2><Link href={status === 'authenticated' ? '/dashboard' : '/login'}><a className="link" onClick={onLink}>{status === 'authenticated' ? "Dashboard" : 'Login'}</a></Link></h2>
				{status === 'authenticated' ? null : <h2><Link href="/signup"><a className="link" onClick={onLink}>Sign Up</a></Link></h2>}
				{status === 'authenticated' ? (
					<>
						<hr />
						<h2><Link href="/signout"><a className="link" onClick={onLink}>Sign out</a></Link></h2>
					</>
				) : null}
			</section>
		</main>
	)
}

export default Menu;