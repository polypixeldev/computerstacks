import axios from 'axios';
import prettyMs from 'pretty-ms';

import HeadStyles from '../styles/Head.module.css';
import HomeStyles from '../styles/Home.module.css';

function Events(props) {
	function listEvents(rel) {
		const events = props.data?.events.filter((event) => {
			const eventDate = new Date(event.date).getTime();
			const now = Date.now();
			return rel === 'current'
				? now >= eventDate && now <= eventDate + event.duration
				: rel === 'future'
				? now <= eventDate
				: now >= eventDate + event.duration;
		});

		if (!events || events?.length === 0)
			return (
				<div>
					<p>No {rel} events right now... Check back later!</p>
				</div>
			);

		return events.map((event) => (
			<div key={event.name} className={HomeStyles.eventCard}>
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
			<section className={HeadStyles.head}>
				<h2>Event Calendar</h2>
				<p>Check out our upcoming events!</p>
			</section>
			<section className="section1">
				<h2>Ongoing</h2>
				{listEvents('current')}
			</section>
			<section className="section2">
				<h2>Upcoming</h2>
				{listEvents('future')}
			</section>
			<section className="section3">
				<h2>Past</h2>
				{listEvents('past')}
			</section>
		</main>
	);
}

async function getStaticProps() {
	const EVENTS_META_URL = `/api/events/fetch`;

	let res = { revalidate: 60, props: { data: {}, error: false } };

	let data = await axios.get(EVENTS_META_URL);
	data = data.data;
	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export { getStaticProps };

export default Events;
