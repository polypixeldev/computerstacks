import Link from "next/link";
import { useSession } from "next-auth/react";

function Menu({ onLink }) {
	const { data: session, status } = useSession();

	return (
		<main>
			<section className="section1">
				<h2>
					<Link href="/">
						<a className="link">Home</a>
					</Link>
				</h2>
				<h2>
					<Link href="/library">
						<a className="link">Library</a>
					</Link>
				</h2>
				<h2>
					<Link href="/roadmaps">
						<a className="link">Roadmaps</a>
					</Link>
				</h2>
				<h2>
					<Link href="/events">
						<a className="link">Events</a>
					</Link>
				</h2>
				<h2>
					<Link href="/settings">
						<a className="link">Settings</a>
					</Link>
				</h2>
				<h2>
					<Link href={status === "authenticated" ? "/dashboard" : "/login"}>
						<a className="link">
							{status === "authenticated" ? "Dashboard" : "Login"}
						</a>
					</Link>
				</h2>
				{status === "authenticated" ? null : (
					<h2>
						<Link href="/signup">
							<a className="link">Sign Up</a>
						</Link>
					</h2>
				)}
				{status === "authenticated" ? (
					<>
						<hr />
						<h2>
							<Link href="/signout">
								<a className="link">Sign out</a>
							</Link>
						</h2>
					</>
				) : null}
			</section>
		</main>
	);
}

export default Menu;
