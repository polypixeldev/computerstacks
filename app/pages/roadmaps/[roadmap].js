import HeadStyles from "../../styles/Head.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import Loading from "../../components/loading";

function Roadmap(props) {
	const router = useRouter();
	if (router.isFallback) return <Loading />;

	return (
		<main>
			<section className={HeadStyles.head}>
				<h2>{props.data.name}</h2>
				<p>{props.data.description}</p>
				<div className={HeadStyles.actionDiv}>
					<p>1</p>
					<p>2</p>
					<p>3</p>
				</div>
			</section>
			<section className="section1">
				<h2>Roadmap</h2>
				<Image
					src={props.data.image}
					alt="The roadmap"
					width={800}
					height={600}
				/>
			</section>
			<section className="section2">
				<h2>Comments</h2>
			</section>
		</main>
	);
}

export async function getStaticPaths() {
	const ROADMAPS_META_URL = `/api/roadmaps/meta`;

	let res = { paths: [], fallback: true };

	const data = await axios.get(ROADMAPS_META_URL)?.data;

	if (!data) return res;

	for (let roadmap of data.roadmaps)
		res.paths.push({ params: { roadmap: roadmap.uri } });

	return res;
}

export async function getStaticProps({ params }) {
	const ROADMAP_DATA_URL = `/api/roadmaps/roadmap?uri=${params.roadmap}`;

	let res = { revalidate: 60, props: { data: {}, error: false } };

	let data = await axios.get(ROADMAP_DATA_URL);
	data = data.data;
	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export default Roadmap;
