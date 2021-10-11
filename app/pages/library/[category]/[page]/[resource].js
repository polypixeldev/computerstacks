import { useRouter } from 'next/router';
import HeadStyle from '../../../../styles/Head.module.css';

function Resource() {
	const router = useRouter();
	const { category, page, resource } = router.query;

	return (
		<main>
			<section className={HeadStyle.head} id="head">
				<h4>{category}</h4>
				<h3>{page}</h3>
				<h2>{resource}</h2>
				<p>(description) Lorem ipsum dolor sit amet, consectetur</p>
				<div className={HeadStyle.actionDiv}>
					<p>1</p>
					<p>2</p>
					<p>3</p>
				</div>
			</section>
			<section className="section1">
				<h2>Comments</h2>
				<div>
					<p>1</p>
					<p>2</p>
					<p>3</p>
				</div>
			</section>
		</main>
	)
}

export default Resource;