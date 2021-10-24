import Link from 'next/link';
import HeadStyle from '../styles/Head.module.css';

function CategoryPage(props) {
	console.log(props.data.items)
	function getLevel(level) {
		return props.data.items[level].map(item => (
			<div key={item.name}>
				<p><strong><Link href={`/library/${props.category}/${item.uri}`}><a className="link">{item.name}</a></Link></strong></p>
			</div>
		))
	}

	return (
		<main>
			<section className={HeadStyle.head} id="head">
				<h2>{props.data.name}</h2>
				<p>{props.data.description}</p>
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
				{getLevel(0)}
			</section>
			<section className="section2">
				<div>
					<p>2</p>
				</div>
				{getLevel(1)}
			</section>
			<section className="section3">
				<div>
					<p>3</p>
				</div>
				{getLevel(2)}
			</section>
		</main>
	)
}

export default CategoryPage;