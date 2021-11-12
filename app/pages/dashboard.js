import styles from "../styles/Dashboard.module.css";
import { useSession } from "next-auth/react";
import Loading from "../components/loading";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import profile from "../public/profile.png";
import axios from "axios";
import { useEffect, useState } from "react";

function Dashboard() {
	const [favorites, setFavorites] = useState([]);
	const router = useRouter();
	const { data: session, status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push("/login");
		},
	});

	useEffect(() => {
		if (status !== "authenticated") return;
		console.log("e");

		let newFavs = [];
		let queries = [];

		for (let fav of session.user.favorites) {
			const uri = fav.split("/")[2];

			queries.push(
				axios.get(`/api/library/resource?uri=${uri}`).then((res) => {
					newFavs.push({ ...res.data, uri: fav });
				})
			);
		}

		Promise.all(queries).then(() => {
			setFavorites(newFavs);
		});
	}, [status, session?.user.favorites]);

	if (status === "loading") return <Loading />;

	function listFavorites() {
		console.log(favorites);
		return favorites.map((favorite) => (
			<h3 key={favorite.uri}>
				<Link href={`/library/${favorite.uri}`}>
					<a className="link">{favorite.name}</a>
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
			</section>
			<section className="section3">
				<h2>Favorites</h2>
				{listFavorites()}
			</section>
		</main>
	);
}

export default Dashboard;
