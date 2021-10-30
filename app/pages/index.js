import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import Background from "../public/tech.png";
import Icons from "../public/icons.png";

export default function Home() {
	return (
		<main>
			<section className="top">
				<Image
					priority={true}
					src={Background}
					alt="background"
					layout="fill"
					objectFit="fill"
				/>
				<Image src={Icons} alt="Computer Icons" className={styles.icons} />
				<p className={styles.blurb}>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit
				</p>
			</section>
			<section className="section1" id="main-desc">
				<h2>The world&apos;s largest collection of computer resources</h2>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
				<button className="button">
					<Link href="/library">
						<a className="link">Browse now</a>
					</Link>
				</button>
			</section>
			<section className="section2" id="events">
				<h2>Events</h2>
				<div className={styles.eventCard}>
					<h3>Event</h3>
					<div>
						<p>Lorem ipsum dolor sit amet, consectetur</p>
					</div>
				</div>
				<p>
					<Link href="/events">
						<a className="link">View the entire event calendar</a>
					</Link>
				</p>
			</section>
			<section className="section3" id="cards">
				<div className={styles.card}>
					<p>Lorem ipsum dolor sit amet, consectetur</p>
				</div>
				{/* Card Carousel? */}
			</section>
		</main>
	);
}
