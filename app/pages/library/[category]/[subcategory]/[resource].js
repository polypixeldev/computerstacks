import { useRouter } from "next/router";
import ResourcePage from "../../../../components/resourcepage";
import Loading from "../../../../components/loading";
import axios from "axios";

function Resource(props) {
	const router = useRouter();
	if (router.isFallback) return <Loading />;

	return <ResourcePage data={props.data} {...router.query} />;
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
				for (let subcat of sublevel) {
					const SUBCATEGORY_DATA_URL = `/api/library/subcategory?uri=${subcat.uri}`;

					let subcatdata = await axios.get(SUBCATEGORY_DATA_URL);
					subcatdata = subcatdata.data;

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

export async function getStaticProps({ params }) {
	const RESOURCE_URL = `/api/library/resource?uri=${params.resource}`;

	let res = { revalidate: 60, props: { data: {}, error: false } };

	let data = await axios.get(RESOURCE_URL);
	data = data.data;
	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export default Resource;
