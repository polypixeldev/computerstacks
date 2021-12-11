import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import prettyMs from 'pretty-ms';

import styles from '../styles/Home.module.css';

import Background from '../public/tech.png';
import Icons from '../public/icons.png';

import eventsFetch from '../functions/eventsFetch';

function Home(props) {
	function listEvents() {
		const events = props.data?.events.filter((event) => {
			const eventDate = new Date(event.date).getTime();
			const now = Date.now();
			return now >= eventDate && now <= eventDate + event.duration;
		});

		if (!events || events?.length === 0)
			return (
				<div>
					<p>No upcoming events right now... Check back later!</p>
				</div>
			);

		return events.map((event) => (
			<div key={event.name} className={styles.eventCard}>
				<h3>{event.name}</h3>
				<p>{prettyMs(event.duration, { verbose: true })}</p>
				<div>
					<p>{event.description}</p>
				</div>
			</div>
		));
	}

	return (
		<main>
			<section className="top">
				<Image
					priority={true}
					src={Background}
					alt="background"
					layout="fill"
					objectFit="fill"
				/>
				<Image src={Icons} alt="Computer Icons" className={styles.icons} />
				<p className={styles.blurb}>
					<strong>
						<em>The universal collection of computer-related resources</em>
					</strong>
				</p>
			</section>
			<section className="section1" id="main-desc">
				<h2>The world&apos;s largest collection of computer resources</h2>
				<p>
					ComputerStacks is a free, open-source online collection of resources
					related to computers to help you learn about computers in this digital
					world. Click the button below to browse the library, or enter a query
					in the search bar above.
				</p>
				<button className="button">
					<Link href="/library">
						<a className="link">Browse now</a>
					</Link>
				</button>
			</section>
			<section className="section2" id="events">
				<h2>Events</h2>
				{listEvents()}
				<p>
					<Link href="/events">
						<a className="link">View the entire event calendar</a>
					</Link>
				</p>
			</section>
			<section className="section3" id="cards">
				<div className={styles.card}>
					<p>
						Visit the ComputerStacks GitHub repository at{' '}
						<Link href="https://github.com/Poly-Pixel/computerstacks">
							<a className="link" target="_blank">
								https://github.com/Poly-Pixel/computerstacks
							</a>
						</Link>
					</p>
				</div>
				<div className={styles.card}>
					<p>
						Fill out a quick survey to help improve ComputerStacks! See{' '}
						<Link href="https://forms.office.com/r/jbPz5Y5fJW">
							<a className="link" target="_blank">
								https://forms.office.com/r/jbPz5Y5fJW
							</a>
						</Link>
					</p>
				</div>
				{/* Card Carousel? */}
			</section>
		</main>
	);
}

async function getStaticProps() {
	let res = { revalidate: 43200, props: { data: {}, error: false } };

	const data = await eventsFetch();

	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export { getStaticProps };

export default Home;
