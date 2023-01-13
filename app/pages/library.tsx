import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import superjson from 'superjson';

import Card from '../components/card';
import { appRouter } from '../server/routers/_app';
import { trpc } from '../util/trpc';
import { intoLevels } from '../util/intoLevels';

function Library() {
	const metaQuery = trpc.library.meta.useQuery();
	const categoriesQuery = trpc.library.rootCategories.useQuery();

	function getLevel(level: number) {
		const categoryLevels = intoLevels(categoriesQuery.data ?? []);
		return categoryLevels[level].map((subject) => (
			<Card {...subject} path={subject.uri} key={subject.uri} />
		));
	}

	return (
		<main>
			<section className="bg-head-3" id="head">
				<h2 className="mb-1 text-5xl">Resource Library</h2>
				<p className="text-2xl">
					Browse {metaQuery.data?.numResources} resources in{' '}
					{metaQuery.data?.numCategories} subjects
				</p>
			</section>
			<section className="bg-gray-1">{getLevel(0)}</section>
			<section className="bg-gray-2">{getLevel(1)}</section>
			<section className="bg-gray-3">{getLevel(2)}</section>
		</main>
	);
}

async function getStaticProps() {
	const ssg = await createProxySSGHelpers({
		router: appRouter,
		ctx: {
			session: null,
		},
		transformer: superjson,
	});

	await ssg.library.meta.prefetch();
	await ssg.library.rootCategories.prefetch();

	return {
		revalidate: 86400,
		props: {
			trpcState: ssg.dehydrate(),
		},
	};
}

export { getStaticProps };

export default Library;
