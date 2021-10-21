import HeadStyle from '../styles/Head.module.css';
import axios from 'axios';
import Link from "next/link";

function Library(props) {
	function getLevel(level) {
		if(props.error) {
			return <code>ERROR</code>
		}

		return props.data.subjects[level].map(subject => (
			<div key={subject.name}>
				<p><strong><Link href={`/library/${subject.uri}`}><a className="link">{subject.name}</a></Link></strong></p>
			</div>
		))
	}

	return (
		<main>
			<section className={HeadStyle.head} id="head">
				<h2>Resource Library</h2>
				<p>Browse {props.data.numResources} resources in {props.data.numSubjects} subjects</p>
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

export async function getStaticProps(context) {
	/* For development
	return {
		props: {
			data: {
				numResources: 5,
				numSubjects: 10,
				subjects: [
					[{ name: "Yes", uri: "yes" }, { name: "Hmmm", uri: "hmmm" }],
					[{ name: "No", uri: "no" }],
					[{ name: "Maybe", uri: "maybe" }]
				]
			}
		}
	}
	*/
	const RESOURCES_META_URL = ``; // Fetches names and location of resources, nothing else
	
	let res = { revalidate: 60, props: { data: {}, error: false } };

	const data = await axios.get(RESOURCES_META_URL)?.data;
	if(!data) res.props.error = true; else res.props.data = data;
	
	return res;
}

export default Library;