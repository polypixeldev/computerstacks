import HeadStyles from "../styles/Head.module.css";

function Roadmaps() {
	return (
		<main>
			<section className={HeadStyles.head}>
				<h2>Roadmaps</h2>
				<p>Your new helper for learning what you need to learn</p>
			</section>
			<section className="section1">
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
				<button className="button">Explore now</button>
			</section>
		</main>
	)
}

export default Roadmaps;