import Link from 'next/link';
import HeadStyle from '../styles/Head.module.css';

function CategoryPage(props) {
	console.log(props.data.items)
	function getLevel(level) {
		return props.data.items[level].map(item => (
			<div key={item.name}>
				<p><strong><Link href={`/library/${props.category}${props.page ? `/${props.page}/` : `/`}${item.uri}`}><a className="link">{item.name}</a></Link></strong></p>
			</div>
		))
	}

	return (
		<main>
			<section className={HeadStyle.head} id="head">
				{props.data.subcategory ? <h3>{props.data.category}</h3> : null}
				{props.data.subcategory ? <h2>{props.data.subcategory}</h2> : <h2>{props.data.category}</h2>}
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