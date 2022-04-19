import axios from 'axios';

import Card from '../components/card';

import HeadStyle from '../styles/Head.module.css';

import libraryMeta from '../functions/libraryMeta';

import LibraryMeta from '../interfaces/api/LibraryMeta';

interface LibraryProps {
	data: LibraryMeta,
	error: boolean
}

function Library(props: LibraryProps) {
	function getLevel(level: number) {
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

async function getStaticProps() {
	let res = { revalidate: 43200, props: { data: {}, error: false } };

	const data = await libraryMeta();
	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export { getStaticProps };

export default Library;
