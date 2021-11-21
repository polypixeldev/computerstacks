import axios from 'axios';
import Link from 'next/link';

import HeadStyles from '../../styles/Head.module.css';

function Explore(props) {
	function getLevel(level) {
		return props.data.roadmaps[level].map((item) => (
			<div key={item.name}>
				<p>
					<strong>
						<Link href={`/roadmaps/${item.uri}`}>
							<a className="link">{item.name}</a>
						</Link>
					</strong>
				</p>
			</div>
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
	const ROADMAPS_META_URL = `/api/roadmaps/meta`;

	let res = { revalidate: 60, props: { data: {}, error: false } };

	let data = await axios.get(ROADMAPS_META_URL);
	data = data.data;
	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export { getStaticProps };

export default Explore;
