import { useRouter } from 'next/router';
import HeadStyles from "../../styles/Head.module.css";

function Roadmap() {
	const router = useRouter();
	const { roadmap } = router.query;
	return (
		<main>
			<section className={HeadStyles.head}>
				<h2>{roadmap}</h2>
				<p>(description) Lorem ipsum dolor sit amet, consectetur</p>
				<div className={HeadStyles.actionDiv}>
					<p>1</p>
					<p>2</p>
					<p>3</p>
				</div>
			</section>
			<section className="section1">
				<h2>Roadmap</h2>
			</section>
			<section className="section2">
				<h2>Comments</h2>
			</section>
		</main>
	)
}

export default Roadmap;