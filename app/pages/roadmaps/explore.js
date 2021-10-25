import HeadStyles from "../../styles/Head.module.css";
import axios from 'axios';
import Link from 'next/link';

function Explore(props) {
	function getLevel(level){
		return props.data.roadmaps[level].map(item => (
			<div key={item.name}>
				<p><strong><Link href={`/roadmaps/${item.uri}`}><a className="link">{item.name}</a></Link></strong></p>
			</div>
		))
	}

	return (
		<main>
			<section className={HeadStyles.head}>
				<h2>Explore Roadmaps</h2>
				<p>Explore {props.data.numRoadmaps} roadmaps to get started!</p>
			</section>
			<section className="section1">
				<div>
					<p>1</p>
				</div>
				{getLevel(0)}
			</section>
			<section className="section2">
				<div>
					<p>2</p>
				</div>
				{getLevel(1)}
			</section>
			<section className="section3">
				<div>
					<p>3</p>
				</div>
				{getLevel(2)}
			</section>
		</main>
	)
}

export async function getStaticProps() {
	// For development

	return {
		props: {
			data: {
				numRoadmaps: 5,
				roadmaps: [
					[{ name: "a", uri: "a"}],
					[{ name: "b", uri: "b"}],
					[{ name: "c", uri: "c"}]
				]
			}
		}
	}

	const ROADMAPS_META_URL = ``;

	let res = { revalidate: 60, props: { data: {}, error: false } };

	let data = await axios.get(ROADMAPS_META_URL);
	data = data.data;
	if(!data) res.props.error = true; else res.props.data = data;

	return res;
}

export default Explore;