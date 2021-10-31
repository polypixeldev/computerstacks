import HeadStyles from "../styles/Head.module.css";
import HomeStyles from "../styles/Home.module.css";
import prettyMs from "pretty-ms";

function Events(props) {
	function listEvents(rel) {
		const events = props.data?.events.filter((event) =>
			rel === "current"
				? Date.now() >= event.date && Date.now() <= event.date + event.duration
				: rel === "future"
				? Date.now() <= event.date
				: Date.now() >= event.date + event.duration
		);

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
				{listEvents("current")}
			</section>
			<section className="section2">
				<h2>Upcoming</h2>
				{listEvents("future")}
			</section>
			<section className="section3">
				<h2>Past</h2>
				{listEvents("past")}
			</section>
		</main>
	);
}

export async function getStaticProps() {
	// For development

	return {
		props: {
			data: {
				events: [
					{
						name: "Event",
						date: Date.now(),
						duration: 60000,
						description: "A Current Event",
					},
					{
						name: "Dead Event",
						date: Date.now() - 86400000,
						duration: 60000,
						description: "A Past Event",
					},
					{
						name: "New Event",
						date: Date.now() + 86400000,
						duration: 60000,
						description: "A Future Event",
					},
				],
			},
		},
	};

	const EVENTS_META_URL = ``; // Fetches names and location of resources, nothing else

	let res = { revalidate: 60, props: { data: {}, error: false } };

	const data = await axios.get(EVENTS_META_URL)?.data;
	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export default Events;
