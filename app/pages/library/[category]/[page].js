import { useRouter } from 'next/router';
import HeadStyle from '../../../styles/Head.module.css';
import Loading from "../../../components/loading";
import CategoryPage from "../../../components/categorypage";
import ResourcePage from '../../../components/resourcepage';

function Page(props) {
	const router = useRouter();
	
	if(router.isFallback) return <Loading />

	if(props.data.subcategory === true) return <CategoryPage data={props.data} />; else return <ResourcePage data={props.data} />;
}

export async function getStaticPaths() {
	return {
		paths: [{ params: { category: "a", page: "b" }}],
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

		for(let item of catdata.items) {
			const ITEM_META_URL = ``; // Fetches names and location of resources, nothing else

			const subData = await axios.get(ITEM_META_URL)?.data;

			if(!data) return res;

			res.paths.push({ params: { category: category.uri, page: item.uri }})
		}
	}

	return res;
}

export async function getStaticProps({ params }) {
	// For development

	// Subcategory version

	return {
		props: {
			data: {
				subcategory: true,
				name: Array.from(params.category).reverse().join(''),
				description: "desc desc desc",
				items: [
					[{ name: "sub1", uri: "sub1" }, { name: "sub2", uri: "sub2" }],
					[{ name: "sub3", uri: "sub3" }],
					[{ name: "sub4", uri: "sub4" }, { name: "sub5", uri: "sub5" }, {name: "sub6", uri: "sub6" }]
				]
			},
			error: false
		}
	}

	// Resource version

	return {
		props: {
			data: {
				subcategory: false,
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

	const ITEM_META_URL = ``;

	let res = { revalidate: 60, props: { data: {}, error: false }};

	const data = axios.get(ITEM_META_URL)?.data;
	if(!data) res.props.error = true; else res.props.data = data;

	return res;
}

export default Page;