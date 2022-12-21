import { useRouter } from 'next/router';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import superjson from 'superjson';

import Loading from '../../components/loading';
import CategoryPage from '../../components/categorypage';
import { appRouter } from '../../server/routers/_app';
import { trpc } from '../../util/trpc';
import { intoLevels } from '../../util/intoLevels';

import type { GetStaticProps } from 'next';


function LibraryPage() {
	const router = useRouter();

	if (!router.query.uri || typeof router.query.uri === 'string') {
		throw new Error(`Invalid category URI ${router.query.uri}`);
	}

	const lastUri = router.query.uri[router.query.uri.length - 1];
	const categoryQuery = trpc.library.category.useQuery({ uri: lastUri });

	if (router.isFallback || !categoryQuery.data) {
		return <Loading />;
	}

	return <CategoryPage data={categoryQuery.data} categoryURI={lastUri} />;
}

async function getStaticPaths() {
	const res = { paths: new Array<{ params: { uri: string[] } }>(), fallback: true };

	const caller = appRouter.createCaller({ session: null });

	const categories = await caller.library.allCategories();
	const resources = await caller.library.allResources();

	for (const category of categories)
		res.paths.push({ params: { uri: await caller.library.getFullCategoryPath({ uri: category.uri }) } });

	return res;
}

const getStaticProps: GetStaticProps = async ({ params }) => {
	if (!params) {
		throw Error("Category page parameters not found");
	}

	if (!params.uri || typeof params.uri !== 'object') {
		throw Error(`Invalid categorry URI ${params.uri}`);
	}

	const ssg = await createProxySSGHelpers({
		router: appRouter,
		ctx: {
			session: null
		},
		transformer: superjson
	});

	await ssg.library.category.prefetch({ uri: params.uri[params.uri.length - 1] });

	return {
		revalidate: 86400,
		props: {
			trpcState: ssg.dehydrate()
		}
	};
}

export { getStaticPaths, getStaticProps };

export default LibraryPage;
