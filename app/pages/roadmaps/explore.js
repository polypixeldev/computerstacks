import axios from 'axios';

import Card from '../../components/card.js';

import HeadStyles from '../../styles/Head.module.css';

import roadmapsMeta from '../../functions/roadmapsMeta';

function Explore(props) {
	function getLevel(level) {
		return props.data.roadmaps[level].map((item) => (
			<Card {...item} key={item.uri} roadmap={true} />
		));
	}

	return (
		<main>
			<section className={HeadStyles.head}>
				<h2>Explore Roadmaps</h2>
				<p>Explore {props.data.numRoadmaps} roadmaps to get started!</p>
			</section>
			<section className="section1">{getLevel(0)}</section>
			<section className="section2">{getLevel(1)}</section>
			<section className="section3">{getLevel(2)}</section>
		</main>
	);
}

async function getStaticProps() {
	let res = { revalidate: 60, props: { data: {}, error: false } };

	const data = await roadmapsMeta();

	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export { getStaticProps };

export default Explore;
