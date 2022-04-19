import prettyMs from 'pretty-ms';

import HeadStyles from '../styles/Head.module.css';
import HomeStyles from '../styles/Home.module.css';

import eventsFetch from '../functions/eventsFetch';

import Event from '../interfaces/db/Event';

interface EventsProps {
	data: {
		events: Event[]
	}
}

function Events(props: EventsProps) {
	function listEvents(rel: string) {
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
	let res = { revalidate: 43200, props: { data: {}, error: false } };

	const data = await eventsFetch();
	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export { getStaticProps };

export default Events;
