import Link from 'next/link';

import Button from '../components/button';

function Roadmaps() {
	return (
		<main>
			<section className="bg-head-3">
				<h2 className="text-5xl">Roadmaps</h2>
				<p className="m-2 text-2xl">
					Your new helper for learning what you need to learn
				</p>
			</section>
			<section className="bg-gray-1">
				<p className="text-2xl">
					Need help figuring out where to start? Click the link below to take a
					quiz to help you choose your roadmap.
				</p>
				<Button>
					<Link href="/roadmaps/discover" className="text-white no-underline">
						Discover your roadmap
					</Link>
				</Button>
			</section>
			<section className="bg-gray-2">
				<p className="text-2xl">
					Browse our collection of roadmaps from{' '}
					<Link
						href="https://roadmap.sh"
						className="text-white no-underline"
						target="_blank"
					>
						roadmap.sh
					</Link>{' '}
					by clicking the button below.
				</p>
				<Button>
					<Link href="/roadmaps/explore" className="text-white no-underline">
						Explore now
					</Link>
				</Button>
			</section>
		</main>
	);
}

export default Roadmaps;
