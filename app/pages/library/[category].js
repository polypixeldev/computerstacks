import { useRouter } from 'next/router';
import axios from 'axios';
import Loading from '../../components/loading';
import CategoryPage from '../../components/categorypage';

function Category(props) {
	const router = useRouter();

	if (router.isFallback) {
		return <Loading />;
	}

	if (props.error) {
		return null;
	}

	return <CategoryPage data={props.data} category={router.query.category} />;
}

export async function getStaticPaths() {
	const RESOURCES_META_URL = `/api/library/meta`; // Fetches names and location of resources, nothing else

	let res = { paths: [], fallback: true };

	let data = await axios.get(RESOURCES_META_URL);

	data = data.data;

	if (!data) return res;

	for (let level of data.subjects)
		for (let subject of level)
			res.paths.push({ params: { category: subject.uri } });

	return res;
}

export async function getStaticProps({ params }) {
	const CATEGORY_DATA_URL = `/api/library/category?uri=${params.category}`;

	let res = { revalidate: 60, props: { data: {}, error: false } };

	let data = await axios.get(CATEGORY_DATA_URL);
	data = data.data;
	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export default Category;
