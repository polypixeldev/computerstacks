import Link from 'next/link';
import LegacyImage from 'next/legacy/image';
import prettyMs from 'pretty-ms';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import superjson from 'superjson';

import Icons from '../public/icons.png';
import Button from '../components/button';

import { trpc } from '../util/trpc';
import { appRouter } from '../server/routers/_app';

function Home() {
	const fetchQuery = trpc.events.fetch.useQuery();

	function listEvents() {
		const events = fetchQuery.data?.events.filter((event) => {
			const eventDate = new Date(event.date).getTime();
			const now = Date.now();
			return now >= eventDate && now <= eventDate + event.duration;
		});

		if (!events || events?.length === 0)
			return (
				<div>
					<p className="text-2xl">No events right now... Check back later!</p>
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
						Started on {new Date(event.date).toLocaleString()}
					</p>
					<p className="text-xl font-bold">
						{prettyMs(event.duration, { verbose: true })}
					</p>
				</div>
			</div>
		));
	}

	return (
		<main className="">
			<section className="centered h-[65vh] w-screen bg-head-3">
				<LegacyImage src={Icons} alt="Computer Icons" />
				<p>
					<strong>
						<em className="font-zilla-slab text-3xl">
							The universal collection of computer-related resources
						</em>
					</strong>
				</p>
			</section>
			<section className="bg-gray-1" id="main-desc">
				<p className="px-36 font-open-sans text-3xl">
					ComputerStacks is a free, open-source online collection of resources
					related to computers to help you learn about computers in this digital
					world. Click the button below to browse the library, or enter a query
					in the search bar above.
				</p>
				<Button>
					<Link href="/library" className="text-white no-underline">
						Browse now
					</Link>
				</Button>
			</section>
			<section className="bg-gray-2" id="events">
				<h2 className="mb-2 text-5xl font-bold">Events</h2>
				{listEvents()}
				<Button>
					<Link href="/events" className="text-white no-underline">
						View the entire event calendar
					</Link>
				</Button>
			</section>
			<section className="bg-gray-3" id="cards">
				<div className="m-3 flex min-h-min max-w-full flex-col items-center justify-center break-words rounded-md border-2 border-black bg-card p-5 shadow-sm shadow-black">
					<p className="font-dosis text-2xl">
						Visit the{' '}
						<Link
							href="https://github.com/polypixeldev/computerstacks"
							className="text-white underline"
							target="_blank"
						>
							ComputerStacks GitHub repository
						</Link>{' '}
						to learn more about the code powering this website
					</p>
				</div>
				<div className="m-3 flex min-h-min max-w-full flex-col items-center justify-center break-words rounded-md border-2 border-black bg-card p-5 shadow-sm shadow-black">
					<p className="font-dosis text-2xl">
						Fill out{' '}
						<Link
							href="https://forms.office.com/r/jbPz5Y5fJW"
							className="text-white underline"
							target="_blank"
						>
							this quick survey
						</Link>{' '}
						to help improve ComputerStacks!
					</p>
				</div>
			</section>
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

	await ssg.events.fetch.prefetch();

	return {
		revalidate: 86400,
		props: {
			trpcState: ssg.dehydrate(),
		},
	};
}

export { getStaticProps };

export default Home;
