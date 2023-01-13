import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import superjson from 'superjson';

import Card from '../../components/card';
import { appRouter } from '../../server/routers/_app';
import { trpc } from '../../util/trpc';
import { intoLevels } from '../../util/intoLevels';

function Explore() {
	const roadmapsMetaQuery = trpc.roadmaps.meta.useQuery();

	function getLevel(level: number) {
		const roadmaps = roadmapsMetaQuery.data?.roadmaps;

		if (!roadmaps) return [];

		const roadmapLevels = intoLevels(roadmaps);

		return roadmapLevels[level]?.map((item) => (
			<Card {...item} key={item.uri} roadmap={true} />
		));
	}

	return (
		<main>
			<section className="bg-head-3">
				<h2 className="text-5xl">Explore Roadmaps</h2>
				<p className="text-3xl">
					Explore {roadmapsMetaQuery.data?.numRoadmaps} roadmap
					{roadmapsMetaQuery.data?.numRoadmaps === 1 ? '' : 's'} to get started!
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

	await ssg.roadmaps.meta.prefetch();

	return {
		revalidate: 86400,
		props: {
			trpcState: ssg.dehydrate(),
		},
	};
}

export { getStaticProps };

export default Explore;
