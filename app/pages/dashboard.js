import styles from "../styles/Dashboard.module.css";
import { useSession } from "next-auth/react";

function Dashboard() {
	const { data: session, status } = useSession();

	console.log(status);
	
	return (
		<main>
			<section className="section1">
				<h2>Username</h2>
				<span className={styles.pfp}></span>
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