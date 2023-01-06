import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import superjson from 'superjson';

import Card from '../../components/card';
import { appRouter } from '../../server/routers/_app';
import { trpc } from '../../util/trpc';
import { intoLevels } from '../../util/intoLevels';

import HeadStyles from '../../styles/Head.module.css';

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
			<section className={HeadStyles.head}>
				<h2>Explore Roadmaps</h2>
				<p>Explore {roadmapsMetaQuery.data?.numRoadmaps} roadmaps to get started!</p>
			</section>
			<section className="section1">{getLevel(0)}</section>
			<section className="section2">{getLevel(1)}</section>
			<section className="section3">{getLevel(2)}</section>
		</main>
	);
}

async function getStaticProps() {
	const ssg = await createProxySSGHelpers({
		router: appRouter,
		ctx: {
			session: null
		},
		transformer: superjson
	});

	await ssg.roadmaps.meta.prefetch();

	return {
		revalidate: 86400,
		props: {
			trpcState: ssg.dehydrate()
		}
	};
}

export { getStaticProps };

export default Explore;
