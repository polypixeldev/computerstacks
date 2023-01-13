import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import Loading from '../components/loading';
import Card from '../components/card';
import { trpc } from '../util/trpc';

import profile from '../public/profile.png';

function Dashboard() {
	const router = useRouter();
	const { data: session, status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push('/login');
		},
	});

	if (status === 'loading') return <Loading />;

	function listFavoriteResources() {
		return session?.user.favoriteResources.map((uri) => (
			<FavoriteResource key={uri} uri={uri} />
		));
	}

	function listFavoriteCategories() {
		return session?.user.favoriteCategories.map((uri) => (
			<FavoriteCategory key={uri} uri={uri} />
		));
	}

	function listRoadmaps() {
		return session?.user.roadmaps.map((uri) => <Roadmap key={uri} uri={uri} />);
	}

	return (
		<main>
			<section className="bg-gray-1">
				<h2 className="mb-2 text-5xl">
					{session.user.name ?? session.user.email}
				</h2>
				<Image
					className="h-72 w-72 max-w-full rounded-full bg-gray-400"
					src={session.user.image || profile}
					alt="User Profile Picture"
					width={200}
					height={200}
				/>
			</section>
			<section className="bg-gray-2">
				<h2 className="text-4xl">Roadmaps</h2>
				{listRoadmaps()}
			</section>
			<section className="bg-gray-3">
				<h2 className="text-4xl">Favorite Categories</h2>
				<div className="align-center flex w-full flex-row flex-wrap justify-center">
					{listFavoriteCategories()}
				</div>

				<h2 className="text-4xl">Favorite Resources</h2>
				<div className="align-center flex w-full flex-row flex-wrap justify-center">
					{listFavoriteResources()}
				</div>
			</section>
		</main>
	);
}

function FavoriteResource(props: { uri: string }) {
	const resourceQuery = trpc.library.resource.useQuery({ uri: props.uri });
	const fullPathQuery = trpc.library.getFullCategoryPath.useQuery(
		{ uri: resourceQuery.data?.parentId ?? '' },
		{ enabled: !!resourceQuery.data }
	);

	if (!resourceQuery.data || !fullPathQuery.data) return null;

	return (
		<Card
			resource={true}
			uri={props.uri}
			name={resourceQuery.data.name}
			description=""
		/>
	);
}

function FavoriteCategory(props: { uri: string }) {
	const categoryQuery = trpc.library.category.useQuery({ uri: props.uri });
	const fullPathQuery = trpc.library.getFullCategoryPath.useQuery({
		uri: props.uri,
	});

	if (!categoryQuery.data || !fullPathQuery.data) return null;

	return (
		<Card
			category={true}
			uri={props.uri}
			name={categoryQuery.data.name}
			description=""
		/>
	);
}

function Roadmap(props: { uri: string }) {
	const roadmapQuery = trpc.roadmaps.roadmap.useQuery({ uri: props.uri });

	if (!roadmapQuery.data) return null;

	return (
		<p>
			<Link href={`/roadmaps/${props.uri}`} className="text-white no-underline">
				{roadmapQuery.data.name}
			</Link>
		</p>
	);
}

export default Dashboard;
