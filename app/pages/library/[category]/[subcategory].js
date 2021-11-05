import { useRouter } from "next/router";
import Loading from "../../../components/loading";
import CategoryPage from "../../../components/categorypage";

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
	return {
		paths: [{ params: { category: "a", subcategory: "b" } }],
		fallback: true,
	};

	const RESOURCES_META_URL = ``; // Fetches names and location of resources, nothing else

	let res = { paths: [], fallback: true };

	let data = await axios.get(RESOURCES_META_URL);
	data = data.data;

	if (!data) return res;

	for (let category of data.subjects) {
		const CATEGORY_DATA_URL = ``;

		let catdata = await axios.get(CATEGORY_DATA_URL);
		catdata = catdata.data;
		if (!catdata) return res;

		for (let item of catdata.items)
			res.paths.push({ params: { category: category.uri, page: item.uri } });
	}

	return res;
}

export async function getStaticProps({ params }) {
	// For development

	// Subcategory version

	return {
		props: {
			data: {
				subcategory: Array.from(params.subcategory).reverse().join(""),
				category: "Parent",
				description: "desc desc desc",
				subcategories: [
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
			error: false,
		},
	};

	// Resource version

	return {
		props: {
			data: {
				uri: "freecodecamp",
				name: "freeCodeCamp",
				description:
					"Learn to code — for free. Build projects. Earn certifications.",
				link: "https://freecodecamp.org",
				category: "Web Development",
			},
			error: false,
		},
	};

	const SUBCATEGORY_DATA_URL = ``;

	let res = { revalidate: 60, props: { data: {}, error: false } };

	let data = await axios.get(SUBCATEGORY_DATA_URL);
	data = data.data;
	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export default Subcategory;
