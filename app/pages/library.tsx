import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import superjson from 'superjson';

import Card from '../components/card';
import { appRouter } from '../server/routers/_app';
import { trpc } from '../util/trpc';
import { intoLevels } from '../util/intoLevels';

import HeadStyle from '../styles/Head.module.css';

function Library() {
	const metaQuery = trpc.library.meta.useQuery();

	function getLevel(level: number) {
		const categoryLevels = intoLevels(metaQuery.data?.categories ?? []);
		return categoryLevels[level].map((subject) => (
			<Card {...subject} key={subject.uri} />
		));
	}

	return (
		<main>
			<section className={HeadStyle.head} id="head">
				<h2>Resource Library</h2>
				<p>
					Browse {metaQuery.data?.numResources} resources in {metaQuery.data?.numCategories}{' '}
					subjects
				</p>
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

	await ssg.library.meta.prefetch();

	return {
		revalidate: 86400,
		props: {
			trpcState: ssg.dehydrate()
		}
	};
}

export { getStaticProps };

export default Library;
