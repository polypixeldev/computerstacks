import { useRouter } from 'next/router';

import Loading from '../../components/loading';
import CategoryPage from '../../components/categorypage';

import libraryMeta from '../../functions/libraryMeta';
import libraryCategory from '../../functions/libraryCategory';

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

async function getStaticPaths() {
	let res = { paths: [], fallback: true };

	const data = await libraryMeta();

	if (!data) return res;

	for (let level of data.subjects)
		for (let subject of level)
			res.paths.push({ params: { category: subject.uri } });

	return res;
}

async function getStaticProps({ params }) {
	let res = { revalidate: 60, props: { data: {}, error: false } };

	const data = await libraryCategory(params.category);
	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export { getStaticPaths, getStaticProps };

export default Category;
