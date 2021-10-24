import { useRouter } from 'next/router';
import ResourcePage from '../../../../components/resourcepage';
import Loading from "../../../../components/loading";
import axios from 'axios';

function Resource(props) {
	const router = useRouter();
	if(router.isFallback) return <Loading />

	return <ResourcePage data={props.data} {...router.query} />
}

export async function getStaticPaths() {
	// For development
	
	return {
		paths: [{ params: { category: "a", page: "b", resource: "c" }}],
		fallback: true
	}

	const RESOURCES_META_URL = ``; // Fetches names and location of resources, nothing else
	
	let res = { paths: [], fallback: true };

	const data = await axios.get(RESOURCES_META_URL)?.data;

	if(!data) return res;

	for(let category of data.subjects) {
		const CATEGORY_DATA_URL = ``;

		const catdata = axios.get(CATEGORY_DATA_URL)?.data;
		if(!catdata) return res;

		let subcats = catdata.items.filter(item => item.subcategory === true)

		for(let subcat of subcats) {
			const ITEM_META_URL = ``; // Fetches names and location of resources, nothing else

			const subData = await axios.get(ITEM_META_URL)?.data;

			if(!data) return res;

			for(let resource of subcat.resources) {
				res.paths.push({ params: { category: category.uri, page: subcat.uri, resource: resource.uri }})
			}
		}
	}

	return res;
}

export async function getStaticProps({ params }) {
	// For development
	console.log('h')

	return {
		props: {
			data: {
				uri: "freecodecamp",
				name: "freeCodeCamp",
				description: "Learn to code — for free. Build projects. Earn certifications.",
				link: "https://freecodecamp.org",
				subcategory: "Courses",
				category: "Web Development"
			},
			error: false
		}
	}

	const RESOURCE_URL = ``;

	let res = { revalidate: 60, props: { data: {}, error: false }};

	const data = axios.get(RESOURCE_URL)?.data;
	if(!data) res.props.error = true; else res.props.data = data;

	return res;
}

export default Resource;