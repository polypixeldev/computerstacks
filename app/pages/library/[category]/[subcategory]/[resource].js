import { useRouter } from 'next/router';

import Loading from '../../../../components/loading';
import ResourcePage from '../../../../components/resourcepage';

import libraryMeta from '../../../../functions/libraryMeta';
import libraryCategory from '../../../../functions/libraryCategory';
import librarySubcategory from '../../../../functions/librarySubcategory';
import libraryResource from '../../../../functions/libraryResource';

function Resource(props) {
	const router = useRouter();
	if (router.isFallback) return <Loading />;

	return <ResourcePage data={props.data} {...router.query} />;
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
				for (let subcat of sublevel) {
					const subcatdata = await librarySubcategory(subcat.uri);

					for (let subsublevel of subcatdata.resources)
						for (let resource of subsublevel)
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

async function getStaticProps({ params }) {
	let res = { revalidate: 60, props: { data: {}, error: false } };

	const data = await libraryResource(params.resource);
	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export { getStaticPaths, getStaticProps };

export default Resource;
