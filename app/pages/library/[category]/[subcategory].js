import { useRouter } from 'next/router';

import Loading from '../../../components/loading';
import CategoryPage from '../../../components/categorypage';

import libraryMeta from '../../../functions/libraryMeta';
import libraryCategory from '../../../functions/libraryCategory';
import librarySubcategory from '../../../functions/librarySubcategory';

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

async function getStaticPaths() {
	let res = { paths: [], fallback: true };

	const data = await libraryMeta();

	if (!data) return res;

	for (let level of data.subjects)
		for (let category of level) {
			const catdata = await libraryCategory(category.uri);
			if (!catdata) return res;

			for (let sublevel of catdata.subcategories)
				for (let item of sublevel)
					res.paths.push({
						params: { category: category.uri, subcategory: item.uri },
					});
		}

	return res;
}

async function getStaticProps({ params }) {
	let res = { revalidate: 60, props: { data: {}, error: false } };

	const data = await librarySubcategory(params.subcategory);
	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export { getStaticPaths, getStaticProps };

export default Subcategory;
