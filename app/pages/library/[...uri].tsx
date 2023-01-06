import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import superjson from 'superjson';

import Loading from '../../components/loading';
import CategoryPage from '../../components/categorypage';
import ResourcePage from '../../components/resourcepage';
import { appRouter } from '../../server/routers/_app';
import { trpc } from '../../util/trpc';

import type { GetStaticProps, InferGetStaticPropsType } from 'next';

function LibraryPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
	const router = useRouter();

	let fullURI = router.query.uri;

	if (!Array.isArray(fullURI)) {
		fullURI = [''];
	}

	const lastUri = fullURI[fullURI.length - 1];

	const categoryQuery = trpc.library.category.useQuery(
		{ uri: lastUri },
		{ enabled: props.isCategory }
	);
	const resourceQuery = trpc.library.resource.useQuery(
		{ uri: lastUri },
		{ enabled: !props.isCategory }
	);

	useEffect(() => {
		if (categoryQuery.data === null || resourceQuery.data === null) {
			router.push('/404');
		}
	}, [categoryQuery.data, resourceQuery.data, router]);

	if (
		router.isFallback ||
		(!categoryQuery.data && !resourceQuery.data) ||
		fullURI[0] === ''
	) {
		return <Loading />;
	}

	if (props.isCategory) {
		return (
			<CategoryPage
				data={categoryQuery.data!}
				fullURI={fullURI.join('/')}
				categoryURI={lastUri}
			/>
		);
	} else {
		return (
			<ResourcePage
				data={resourceQuery.data!}
				fullCategoryURI={fullURI.slice(0, fullURI.length - 1)}
				resourceURI={lastUri}
			/>
		);
	}
}

async function getStaticPaths() {
	const res = {
		paths: new Array<{ params: { uri: string[] } }>(),
		fallback: true,
	};

	const caller = appRouter.createCaller({ session: null });

	const categories = await caller.library.allCategories();
	const resources = await caller.library.allResources();

	for (const category of categories)
		res.paths.push({
			params: {
				uri: await caller.library.getFullCategoryPath({ uri: category.uri }),
			},
		});

	for (const resource of resources) {
		const resourceCategoryPath = await caller.library.getFullCategoryPath({
			uri: resource.parentId,
		});
		res.paths.push({
			params: { uri: [...resourceCategoryPath, resource.uri] },
		});
	}

	return res;
}

const getStaticProps: GetStaticProps = async ({ params }) => {
	if (!params) {
		throw Error('Library page parameters not found');
	}

	if (!params.uri || typeof params.uri !== 'object') {
		throw Error(`Invalid library URI ${params.uri}`);
	}

	const ssg = await createProxySSGHelpers({
		router: appRouter,
		ctx: {
			session: null,
		},
		transformer: superjson,
	});

	const isCategory = await ssg.library.isCategory.fetch({
		uri: params.uri[params.uri.length - 1],
	});

	if (isCategory) {
		await ssg.library.category.prefetch({
			uri: params.uri[params.uri.length - 1],
		});
	} else {
		await ssg.library.resource.prefetch({
			uri: params.uri[params.uri.length - 1],
		});
	}

	return {
		revalidate: 86400,
		props: {
			isCategory,
			trpcState: ssg.dehydrate(),
		},
	};
};

export { getStaticPaths, getStaticProps };

export default LibraryPage;
