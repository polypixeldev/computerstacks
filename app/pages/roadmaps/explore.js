import HeadStyles from "../../styles/Head.module.css";
import axios from 'axios';

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

export async function getStaticProps() {
	const ROADMAPS_META_URL = ``;
	const data = await axios.get(ROADMAPS_META_URL)
}

export default Explore;