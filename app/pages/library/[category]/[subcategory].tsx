import { useRouter } from 'next/router';

import Loading from '../../../components/loading';
import CategoryPage from '../../../components/categorypage';

import libraryMeta from '../../../functions/libraryMeta';
import libraryCategory from '../../../functions/libraryCategory';
import librarySubcategory from '../../../functions/librarySubcategory';

import { GetStaticProps } from 'next'
import { Subcategory } from '../../../interfaces/db/Subcategory';

interface SubcategoryProps {
	data: Subcategory
}

function Subcategory(props: SubcategoryProps) {
	const router = useRouter();

	if (router.isFallback) return <Loading />;

	if(!router.query.category || typeof router.query.category === 'object') {
		throw new Error(`Invalid category URI ${router.query.category}`);
	}

	if(!router.query.subcategory || typeof router.query.subcategory === 'object') {
		throw new Error(`Invalid subcategory URI ${router.query.subcategory}`);
	} 

	return (
		<CategoryPage
			data={props.data}
			categoryURI={router.query.category}
			subcategoryURI={router.query.subcategory}
		/>
	);
}

async function getStaticPaths() {
	const res = { paths: new Array<{ params: { category: string, subcategory: string }}>(), fallback: true };

	const data = await libraryMeta();

	if (!data) return res;

	for (const level of data.subjects)
		for (const category of level) {
			const catdata = await libraryCategory(category.uri);
			if (!catdata) return res;

			for (const sublevel of catdata.subcategories)
				for (const item of sublevel)
					res.paths.push({
						params: { category: category.uri, subcategory: item.uri },
					});
		}

	return res;
}

const getStaticProps: GetStaticProps = async ({ params }) => {
	const res = { revalidate: 43200, props: { data: {}, error: false } };

	if(!params) {
		throw Error("Subcategory page parameters not found");
	}

	if(!params.subcategory || typeof params.subcategory === 'object') {
		throw Error(`Invalid resource URI ${params.subcategory}`);
	}

	const data = await librarySubcategory(params.subcategory);
	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export { getStaticPaths, getStaticProps };

export default Subcategory;
