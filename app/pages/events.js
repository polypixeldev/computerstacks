import HeadStyles from "../styles/Head.module.css";

function Events() {
	return (
		<main>
			<section className={HeadStyles.head}>
				<h2>Event Calendar</h2>
				<p>Check out our upcoming events!</p>
			</section>
			<section className="section1">
				<h2>Ongoing</h2>
			</section>
			<section className="section2">
				<h2>Upcoming</h2>
			</section>
			<section className="section3">
				<h2>Past</h2>
			</section>
		</main>
	)
}

export default Events;