import Link from 'next/link';
import Image from "next/image";
import prettyMs from 'pretty-ms';

import styles from '../styles/Home.module.css';

import Background from '../public/tech.png';
import Icons from '../public/icons.png';

import eventsFetch from '../functions/eventsFetch';

import Event from '../interfaces/db/Event';

interface HomeProps {
	data: {
		events: Event[]
	}
}

function Home(props: HomeProps) {
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
                    fill
                    sizes="100vw"
                    style={{
                        objectFit: "fill"
                    }} />
				<Image
                    src={Icons}
                    alt="Computer Icons"
                    className={styles.icons}
                    style={{
                        maxWidth: "100%",
                        height: "auto"
                    }} />
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
					<Link href="/library" className="link">
						Browse now
					</Link>
				</button>
			</section>
			<section className="section2" id="events">
				<h2>Events</h2>
				{listEvents()}
				<p>
					<Link href="/events" className="link-underline">
						View the entire event calendar
					</Link>
				</p>
			</section>
			<section className="section3" id="cards">
				<div className={styles.card}>
					<p>
						Visit the{' '}
						<Link
                            href="https://github.com/Poly-Pixel/computerstacks"
                            className="link-underline"
                            target="_blank">
							
								ComputerStacks GitHub repository
							
						</Link>{' '}
						to learn more about the code powering this website
					</p>
				</div>
				<div className={styles.card}>
					<p>
						Fill out{' '}
						<Link
                            href="https://forms.office.com/r/jbPz5Y5fJW"
                            className="link-underline"
                            target="_blank">
							
								this quick survey
							
						</Link>{' '}
						to help improve ComputerStacks!
					</p>
				</div>
				{/* Card Carousel? */}
			</section>
		</main>
    );
}

async function getStaticProps() {
	const res = { revalidate: 43200, props: { data: {}, error: false } };

	const data = await eventsFetch();

	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export { getStaticProps };

export default Home;
