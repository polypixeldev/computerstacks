import { useRouter } from 'next/router';
import HeadStyle from '../../styles/Head.module.css';
import axios from 'axios';
import Loading from '../../components/loading';
import Link from 'next/link';

function Category(props) {
	const router = useRouter();

	if(router.isFallback) {
		return <Loading />
	}

	if(props.error) {
		return null;
	}

	function getLevel(level) {
		return props.data.items[level].map(item => (
			<div key={item.name}>
				<p><strong><Link href={`/library/${router.query.category}/${item.uri}`}><a className="link">{item.name}</a></Link></strong></p>
			</div>
		))
	}

	return (
		<main>
			<section className={HeadStyle.head} id="head">
				<h2>{props.data.name}</h2>
				<p>{props.data.description}</p>
				<div className={HeadStyle.actionDiv}>
					<p>1</p>
					<p>2</p>
					<p>3</p>
				</div>
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

export async function getStaticPaths() {
	// For development
	//
	// return {
	// 	paths: [{ params: { category: "yes" } }, { params: { category: "hmmm" } }, { params: { category: "no" } }, { params: { category: "maybe" } }],
	// 	fallback: true
	// }

	const RESOURCES_META_URL = ``; // Fetches names and location of resources, nothing else
	
	let res = { paths: [], fallback: true };

	const data = await axios.get(RESOURCES_META_URL)?.data;

	if(!data) return res;

	for(let subject of data.subjects) {
		res.paths.push({ params: { category: subject.uri } })
	}

	return res;
}

export async function getStaticProps({ params }) {
	// For development
	//
	// return {
	// 	props: {
	// 		data: {
	// 			name: Array.from(params.category).reverse().join(''),
	// 			description: "desc desc desc",
	// 			items: [
	// 				[{ name: "sub1", uri: "sub1" }, { name: "sub2", uri: "sub2" }],
	// 				[{ name: "sub3", uri: "sub3" }],
	// 				[{ name: "sub4", uri: "sub4" }, { name: "sub5", uri: "sub5" }, {name: "sub6", uri: "sub6" }]
	// 			]
	// 		}
	// 	}
	// }
	
	const CATEGORY_DATA_URL = ``;

	let res = { revalidate: 60, props: { data: {}, error: false } };

	const data = axios.get(CATEGORY_DATA_URL)?.data;
	if(!data) res.props.error = true; else res.props.data = data;

	return res;
}

export default Category;