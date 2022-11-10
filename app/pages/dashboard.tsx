import axios from 'axios';
import Link from 'next/link';
import Image from "next/legacy/image";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import Loading from '../components/loading';

import styles from '../styles/Dashboard.module.css';

import profile from '../public/profile.png';

import { DbCategory } from '../interfaces/db/Category';
import { DbSubcategory } from '../interfaces/db/Subcategory';
import { DbResource } from '../interfaces/db/Resource';
import { DbRoadmap } from '../interfaces/db/Roadmap';

function Dashboard() {
	const [favorites, setFavorites] = useState<Array<(DbCategory | DbSubcategory | DbResource) & {uri: string}>>([]);
	const [roadmaps, setRoadmaps] = useState<Array<DbRoadmap & { uri: string }>>([]);

	const router = useRouter();
	const { data: session, status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push('/login');
		},
	});

	useEffect(() => {
		if (status !== 'authenticated') return;

		const newFavs: Array<(DbCategory | DbSubcategory | DbResource) & {uri: string}> = [];
		const queries = [];

		for (const fav of session.user.favorites) {
			const split = fav.split('/');
			const type =
				split.length === 1
					? 'category'
					: split.length === 2
					? 'subcategory'
					: 'resource';
			const uri = split[split.length - 1];

			queries.push(
				axios.get(`/api/library/${type}?uri=${uri}`).then((res) => {
					newFavs.push({ ...res.data, uri: fav });
				})
			);
		}

		Promise.all(queries).then(() => {
			setFavorites(newFavs);
		});
	}, [status, session?.user.favorites]);

	useEffect(() => {
		if (status !== 'authenticated') return;

		const newRoadmaps: Array<DbRoadmap & { uri: string }> = [];
		const queries = [];

		for (const roadmap of session.user.roadmaps) {
			const uri = roadmap;

			queries.push(
				axios.get(`/api/roadmaps/roadmap?uri=${uri}`).then((res) => {
					newRoadmaps.push({ ...res.data, uri: roadmap });
				})
			);
		}

		Promise.all(queries).then(() => {
			setRoadmaps(newRoadmaps);
		});
	}, [status, session?.user.roadmaps]);

	if (status === 'loading') return <Loading />;

	function listFavorites() {
		return favorites.map((favorite) => (
			<h3 key={favorite.uri}>
				<Link href={`/library/${favorite.uri}`} className="link">

                    {favorite.name}

                </Link>
			</h3>
		));
	}

	function listRoadmaps() {
		return roadmaps.map((roadmap) => (
			<h3 key={roadmap.uri}>
				<Link href={`/roadmaps/${roadmap.uri}`} className="link">
					{roadmap.name}
				</Link>
			</h3>
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
				/>
			</section>
			<section className="section2">
				<h2>Roadmaps</h2>
				{listRoadmaps()}
			</section>
			<section className="section3">
				<h2>Favorites</h2>
				{listFavorites()}
			</section>
		</main>
	);
}

export default Dashboard;
