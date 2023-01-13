import Link from 'next/link';
import { useSession } from 'next-auth/react';

function Menu() {
	const { status } = useSession();

	const baseLinks = ['Library', 'Roadmaps', 'Search', 'Events', 'Settings'];

	return (
		<main>
			<section className="color-white absolute left-3 top-3 z-30 flex w-min flex-col items-center justify-start gap-3 rounded-sm border-2 border-black bg-card p-5 text-3xl no-underline shadow-sm shadow-black">
				<Link href="/">Home</Link>

				{baseLinks.map((link) => (
					<Link href={`/${link.toLowerCase()}`} key={link}>
						{link}
					</Link>
				))}

				<hr className="w-20" />

				<Link href={status === 'authenticated' ? '/dashboard' : '/login'}>
					{status === 'authenticated' ? 'Dashboard' : 'Login'}
				</Link>

				{status === 'authenticated' ? (
					<Link href="/signout">Sign out</Link>
				) : (
					<Link href="/signup">Sign Up</Link>
				)}
			</section>
		</main>
	);
}

export default Menu;
