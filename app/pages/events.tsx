import prettyMs from 'pretty-ms';
import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';

import { appRouter } from '../server/routers/_app';
import { trpc } from '../util/trpc';

function Events() {
	const fetchQuery = trpc.events.fetch.useQuery();

	function listEvents(rel: 'current' | 'future' | 'past') {
		const events = fetchQuery.data?.events.filter((event) => {
			const eventDate = new Date(event.date).getTime();
			const now = Date.now();
			return rel === 'current'
				? now >= eventDate && now <= eventDate + event.duration
				: rel === 'future'
				? now <= eventDate
				: now >= eventDate + event.duration;
		});

		if (!events || events?.length === 0)
			return (
				<div>
					<p className="text-2xl">
						No {rel} events right now... Check back later!
					</p>
				</div>
			);

		return events.map((event) => (
			<div
				key={event.name}
				className="mx-1/5 mb-6 flex max-w-screen-md flex-row items-center justify-between gap-5 rounded-lg border-2 border-black bg-card p-3 shadow-sm shadow-black"
			>
				<div>
					<h3 className="text-3xl font-bold">{event.name}</h3>
					<p className="text-2xl">{event.description}</p>
				</div>
				<div>
					<p className="text-xl font-bold">
						{rel === 'future' ? 'Starting' : 'Started'} on{' '}
						{new Date(event.date).toLocaleString()}
					</p>
					<p className="text-xl font-bold">
						{prettyMs(event.duration, { verbose: true })}
					</p>
				</div>
			</div>
		));
	}

	return (
		<main>
			<section className="bg-head-3">
				<h2 className="text-5xl">Event Calendar</h2>
				<p className="text-3xl">Check out our upcoming events!</p>
			</section>
			<section className="bg-gray-1">
				<h2 className="m-2 text-4xl">Ongoing</h2>
				{listEvents('current')}
			</section>
			<section className="bg-gray-2">
				<h2 className="m-2 text-4xl">Upcoming</h2>
				{listEvents('future')}
			</section>
			<section className="bg-gray-3">
				<h2 className="m-2 text-4xl">Past</h2>
				{listEvents('past')}
			</section>
		</main>
	);
}

async function getStaticProps() {
	const ssg = await createServerSideHelpers({
		router: appRouter,
		ctx: {
			session: null,
		},
		transformer: superjson,
	});

	await ssg.events.fetch.prefetch();

	return {
		revalidate: 86400,
		props: {
			trpcState: ssg.dehydrate(),
		},
	};
}

export { getStaticProps };

export default Events;
