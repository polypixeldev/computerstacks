import { useRouter } from "next/router";
import axios from "axios";
import Loading from "../../components/loading";
import CategoryPage from "../../components/categorypage";

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
	// For development

	return {
		paths: [
			{ params: { category: "yes" } },
			{ params: { category: "hmmm" } },
			{ params: { category: "no" } },
			{ params: { category: "maybe" } },
		],
		fallback: true,
	};

	const RESOURCES_META_URL = ``; // Fetches names and location of resources, nothing else

	let res = { paths: [], fallback: true };

	const data = await axios.get(RESOURCES_META_URL)?.data;

	if (!data) return res;

	for (let subject of data.subjects)
		res.paths.push({ params: { category: subject.uri } });

	return res;
}

export async function getStaticProps({ params }) {
	// For development

	return {
		props: {
			data: {
				description: "desc desc desc",
				category: Array.from(params.category).reverse().join(""),
				items: [
					[
						{ name: "sub1", uri: "sub1" },
						{ name: "sub2", uri: "sub2" },
					],
					[{ name: "sub3", uri: "sub3" }],
					[
						{ name: "sub4", uri: "sub4" },
						{ name: "sub5", uri: "sub5" },
						{ name: "sub6", uri: "sub6" },
					],
				],
			},
		},
	};

	const CATEGORY_DATA_URL = ``;

	let res = { revalidate: 60, props: { data: {}, error: false } };

	let data = await axios.get(CATEGORY_DATA_URL);
	data = data.data;
	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export default Category;
