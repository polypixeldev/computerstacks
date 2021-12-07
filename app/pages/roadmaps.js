import Link from 'next/link';

import HeadStyles from '../styles/Head.module.css';

function Roadmaps() {
	return (
		<main>
			<section className={HeadStyles.head}>
				<h2>Roadmaps</h2>
				<p>Your new helper for learning what you need to learn</p>
			</section>
			<section className="section1">
				<p>
					Need help figuring out where to start? Click the link below to take a
					quiz to help you choose your roadmap.
				</p>
				<button className="button">
					<Link href="/roadmaps/discover">
						<a className="link">Discover your roadmap</a>
					</Link>
				</button>
			</section>
			<section className="section2">
				<p>
					Browse our collection of roadmaps from{' '}
					<Link href="https://roadmap.sh">
						<a className="link" target="_blank">
							roadmap.sh
						</a>
					</Link>{' '}
					by clicking the button below.
				</p>
				<button className="button">
					<Link href="/roadmaps/explore">
						<a className="link">Explore now</a>
					</Link>
				</button>
			</section>
		</main>
	);
}

export default Roadmaps;
