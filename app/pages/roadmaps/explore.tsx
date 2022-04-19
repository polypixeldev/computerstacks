import Card from '../../components/card';

import HeadStyles from '../../styles/Head.module.css';

import roadmapsMeta from '../../functions/roadmapsMeta';

import RoadmapsMeta from '../../interfaces/api/RoadmapsMeta';

interface ExploreProps {
	data: RoadmapsMeta 
}

function Explore(props: ExploreProps) {
	function getLevel(level: number) {
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
	const res = { revalidate: 43200, props: { data: {}, error: false } };

	const data = await roadmapsMeta();

	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export { getStaticProps };

export default Explore;
