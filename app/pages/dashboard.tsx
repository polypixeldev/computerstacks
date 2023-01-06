import Link from 'next/link';
import Image from "next/image";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import Loading from '../components/loading';
import { trpc } from '../util/trpc';

import styles from '../styles/Dashboard.module.css';

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
		return session?.user.roadmaps.map((uri) => (
			<Roadmap key={uri} uri={uri} />
		));
	}

	return (
		<main>
			<section className="section1">
				<h2>{session.user.name ?? session.user.email}</h2>
				<Image
					className={styles.pfp}
					src={session.user.image || profile}
					alt="User Profile Picture"
					width={200}
					height={200}
					style={{
						maxWidth: "100%",
						height: "auto"
					}} />
			</section>
			<section className="section2">
				<h2>Roadmaps</h2>
				{listRoadmaps()}
			</section>
			<section className="section3">
				<h2>Favorite Categories</h2>
				{listFavoriteCategories()}
				<h2>Favorite Resources</h2>
				{listFavoriteResources()}
			</section>
		</main>
	);
}

function FavoriteResource(props: { uri: string }) {
	const resourceQuery = trpc.library.resource.useQuery({ uri: props.uri });

	if (!resourceQuery.data) return null;

	return (
		<p>
			<Link href={`/library/${props.uri}`} className="link">
				{resourceQuery.data.name}
			</Link>
		</p>
	);
}

function FavoriteCategory(props: { uri: string }) {
	const categoryQuery = trpc.library.category.useQuery({ uri: props.uri });

	if (!categoryQuery.data) return null;

	return (
		<p>
			<Link href={`/library/${props.uri}`} className="link">
				{categoryQuery.data.name}
			</Link>
		</p>
	);
}

function Roadmap(props: { uri: string }) {
	const roadmapQuery = trpc.roadmaps.roadmap.useQuery({ uri: props.uri });

	if (!roadmapQuery.data) return null;

	return (
		<p>
			<Link href={`/library/${props.uri}`} className="link">
				{roadmapQuery.data.name}
			</Link>
		</p>
	);
}

export default Dashboard;
