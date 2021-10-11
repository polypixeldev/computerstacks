import { useRouter } from 'next/router';
import HeadStyle from '../../styles/Head.module.css';

function Category() {
	const router = useRouter();
	const { category } = router.query;

	return (
		<main>
			<section className={HeadStyle.head} id="head">
				<h2>{category}</h2>
				<p>(description) Lorem ipsum dolor sit amet, consectetur</p>
				<div className={HeadStyle.actionDiv}>
					<p>1</p>
					<p>2</p>
					<p>3</p>
				</div>
			</section>
			<section className="section1">
				<div>
					<p>1</p>
				</div>
			</section>
			<section className="section2">
				<div>
					<p>2</p>
				</div>
			</section>
			<section className="section3">
				<div>
					<p>3</p>
				</div>
			</section>
		</main>
	)
}

export default Category;