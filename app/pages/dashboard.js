import styles from "../styles/Dashboard.module.css";
import { useSession } from "next-auth/react";
import Loading from "../components/loading";
import { useRouter } from "next/router";
import Image from "next/image";
import profile from "../public/profile.png";

function Dashboard() {
	const router = useRouter();
	const { data: session, status } = useSession({
		required: true,
		onUnauthenticated(){
			router.push('/login');
		}
	});

	if(status === 'loading') return <Loading />;

	console.log(session);

	return (
		<main>
			<section className="section1">
				<h2>{session.user.name ?? session.user.email}</h2>
				<Image className={styles.pfp} src={session.user.image || profile} alt="User Profile Picture" width={200} height={200}/>
			</section>
			<section className="section2">
				<h2>Roadmaps</h2>
			</section>
			<section className="section3">
				<h2>Resources</h2>
			</section>
		</main>
	)
}

export default Dashboard;