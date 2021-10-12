import HeadStyles from "../../styles/Head.module.css";

function Explore() {
	return (
		<main>
			<section className={HeadStyles.head}>
				<h2>Explore Roadmaps</h2>
				<p>Explore foo roadmaps to get started!</p>
			</section>
			<section className="section1">
				<div>
					<p>1</p>
				</div>
			</section>
			<section className="section2">
				<div>
					<p>2</p>
				</div>
			</section>
			<section className="section3">
				<div>
					<p>3</p>
				</div>
			</section>
		</main>
	)
}

export default Explore;