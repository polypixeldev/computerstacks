import { useRouter } from 'next/router';

import Loading from '../../../../components/loading';
import ResourcePage from '../../../../components/resourcepage';

import libraryMeta from '../../../../functions/libraryMeta';
import libraryCategory from '../../../../functions/libraryCategory';
import librarySubcategory from '../../../../functions/librarySubcategory';
import libraryResource from '../../../../functions/libraryResource';

import { GetStaticProps } from 'next';
import { Resource } from '../../../../interfaces/db/Resource';

interface ResourceProps {
	data: Resource
}

function Resource(props: ResourceProps) {
	const router = useRouter();
	if (router.isFallback) return <Loading />;

	if(!router.query.category || typeof router.query.category === 'object') {
		throw new Error(`Invalid category URI ${router.query.category}`);
	}

	if(!router.query.subcategory || typeof router.query.subcategory === 'object') {
		throw new Error(`Invalid subcategory URI ${router.query.subcategory}`);
	} 

	if(!router.query.resource || typeof router.query.resource === 'object') {
		throw new Error(`Invalid resource URI ${router.query.resource}`);
	} 

	return <ResourcePage data={props.data} categoryURI={router.query.category} subcategoryURI={router.query.subcategory} resourceURI={router.query.resource} />;
}

async function getStaticPaths() {
	const res = { paths: new Array<{ params: { category: string, subcategory: string, resource: string }}>(), fallback: true };

	const data = await libraryMeta();

	if (!data) return res;

	for (const level of data.subjects)
		for (const category of level) {
			const catdata = await libraryCategory(category.uri);

			if (!catdata) return res;

			for (const sublevel of catdata.subcategories)
				for (const subcat of sublevel) {
					const subcatdata = await librarySubcategory(subcat.uri);

					for (const subsublevel of subcatdata.resources)
						for (const resource of subsublevel)
							res.paths.push({
								params: {
									category: category.uri,
									subcategory: subcat.uri,
									resource: resource.uri,
								},
							});
				}
		}

	return res;
}

const  getStaticProps: GetStaticProps = async ({ params }) => {
	const res = { revalidate: 43200, props: { data: {}, error: false } };

	if(!params) {
		throw Error("Resource page parameters not found");
	}

	if(!params.resource || typeof params.resource === 'object') {
		throw Error(`Invalid resource URI ${params.resource}`);
	}

	const data = await libraryResource(params.resource);
	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export { getStaticPaths, getStaticProps };

export default Resource;
