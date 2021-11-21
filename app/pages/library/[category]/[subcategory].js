import { useRouter } from 'next/router';
import axios from 'axios';
import Loading from '../../../components/loading';
import CategoryPage from '../../../components/categorypage';

function Subcategory(props) {
	const router = useRouter();

	if (router.isFallback) return <Loading />;

	return (
		<CategoryPage
			data={props.data}
			category={router.query.category}
			subcategory={router.query.subcategory}
		/>
	);
}

export async function getStaticPaths() {
	const RESOURCES_META_URL = `/api/library/meta`; // Fetches names and location of resources, nothing else

	let res = { paths: [], fallback: true };

	let data = await axios.get(RESOURCES_META_URL);
	data = data.data;

	if (!data) return res;

	for (let level of data.subjects)
		for (let category of level) {
			const CATEGORY_DATA_URL = `/api/library/category?uri=${category.uri}`;

			let catdata = await axios.get(CATEGORY_DATA_URL);
			catdata = catdata.data;
			if (!catdata) return res;

			for (let sublevel of catdata.subcategories)
				for (let item of sublevel)
					res.paths.push({
						params: { category: category.uri, subcategory: item.uri },
					});
		}

	return res;
}

export async function getStaticProps({ params }) {
	const SUBCATEGORY_DATA_URL = `/api/library/subcategory?uri=${params.subcategory}`;

	let res = { revalidate: 60, props: { data: {}, error: false } };

	let data = await axios.get(SUBCATEGORY_DATA_URL);
	data = data.data;
	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export default Subcategory;
