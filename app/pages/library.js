import axios from 'axios';

import Card from '../components/card.js';

import HeadStyle from '../styles/Head.module.css';

function Library(props) {
	function getLevel(level) {
		if (props.error) {
			return <code>ERROR</code>;
		}

		return props.data.subjects[level].map((subject) => (
			<Card {...subject} key={subject.uri} />
		));
	}

	return (
		<main>
			<section className={HeadStyle.head} id="head">
				<h2>Resource Library</h2>
				<p>
					Browse {props.data.numResources} resources in {props.data.numSubjects}{' '}
					subjects
				</p>
			</section>
			<section className="section1">{getLevel(0)}</section>
			<section className="section2">{getLevel(1)}</section>
			<section className="section3">{getLevel(2)}</section>
		</main>
	);
}

async function getStaticProps(context) {
	const RESOURCES_META_URL = `/api/library/meta`; // Fetches names and location of resources, nothing else

	let res = { revalidate: 60, props: { data: {}, error: false } };

	let data = await axios.get(RESOURCES_META_URL);
	data = data.data;
	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export { getStaticProps };

export default Library;
