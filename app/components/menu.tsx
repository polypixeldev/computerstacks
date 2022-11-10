import Link from 'next/link';
import { useSession } from 'next-auth/react';

function Menu() {
	const { status } = useSession();

	return (
        <main>
			<section className="section1">
				<h2>
					<Link href="/" className="link">
						Home
					</Link>
				</h2>
				<h2>
					<Link href="/library" className="link">
						Library
					</Link>
				</h2>
				<h2>
					<Link href="/roadmaps" className="link">
						Roadmaps
					</Link>
				</h2>
				<h2>
					<Link href="/search" className="link">
						Search
					</Link>
				</h2>
				<h2>
					<Link href="/events" className="link">
						Events
					</Link>
				</h2>
				<h2>
					<Link href="/settings" className="link">
						Settings
					</Link>
				</h2>
				<h2>
					<Link
                        href={status === 'authenticated' ? '/dashboard' : '/login'}
                        className="link">

                        {status === 'authenticated' ? 'Dashboard' : 'Login'}

                    </Link>
				</h2>
				{status === 'authenticated' ? null : (
					<h2>
						<Link href="/signup" className="link">
							Sign Up
						</Link>
					</h2>
				)}
				{status === 'authenticated' ? (
					<>
						<hr />
						<h2>
							<Link href="/signout" className="link">
								Sign out
							</Link>
						</h2>
					</>
				) : null}
			</section>
		</main>
    );
}

export default Menu;
