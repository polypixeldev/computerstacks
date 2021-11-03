import HeadStyle from "../styles/Head.module.css";
import axios from "axios";
import Link from "next/link";

function Library(props) {
	function getLevel(level) {
		if (props.error) {
			return <code>ERROR</code>;
		}

		return props.data.subjects[level].map((subject) => (
			<div key={subject.name}>
				<p>
					<strong>
						<Link href={`/library/${subject.uri}`}>
							<a className="link">{subject.name}</a>
						</Link>
					</strong>
				</p>
			</div>
		));
	}

	return (
		<main>
			<section className={HeadStyle.head} id="head">
				<h2>Resource Library</h2>
				<p>
					Browse {props.data.numResources} resources in {props.data.numSubjects}{" "}
					subjects
				</p>
			</section>
			<section className="section1">{getLevel(0)}</section>
			<section className="section2">{getLevel(1)}</section>
			<section className="section3">{getLevel(2)}</section>
		</main>
	);
}

export async function getStaticProps(context) {
	const RESOURCES_META_URL = `/api/library/meta`; // Fetches names and location of resources, nothing else

	let res = { revalidate: 60, props: { data: {}, error: false } };

	let data = await axios.get(RESOURCES_META_URL);
	data = data.data;
	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export default Library;
