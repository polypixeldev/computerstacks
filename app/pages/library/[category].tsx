import { useRouter } from 'next/router';

import Loading from '../../components/loading';
import CategoryPage from '../../components/categorypage';

import libraryMeta from '../../functions/libraryMeta';
import libraryCategory from '../../functions/libraryCategory';

import { Category } from '../../interfaces/db/Category';
import { GetStaticProps } from 'next';

interface CategoryProps {
	data: Category,
	error: boolean
}

function Category(props: CategoryProps) {
	const router = useRouter();

	if (router.isFallback) {
		return <Loading />;
	}

	if (props.error) {
		return null;
	}

	if(!router.query.category || typeof router.query.category === 'object') {
		throw new Error(`Invalid category URI ${router.query.category}`);
	}

	return <CategoryPage data={props.data} categoryURI={router.query.category} />;
}

async function getStaticPaths() {
	const res = { paths: new Array<{ params: { category: string }}>(), fallback: true };

	const data = await libraryMeta();

	if (!data) return res;

	for (const level of data.subjects)
		for (const subject of level)
			res.paths.push({ params: { category: subject.uri } });

	return res;
}

const getStaticProps: GetStaticProps = async ({ params }) =>  {
	const res = { revalidate: 43200, props: { data: {}, error: false } };

	if(!params) {
		throw Error("Category page parameters not found");
	}

	if(!params.category || typeof params.category === 'object') {
		throw Error(`Invalid category URI ${params.category}`);
	}

	const data = await libraryCategory(params.category);
	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export { getStaticPaths, getStaticProps };

export default Category;
