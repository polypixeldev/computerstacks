import Link from "next/link";
import HeadStyle from "../styles/Head.module.css";

function CategoryPage(props) {
	const items = props.data.subcategories || props.data.resources;
	function getLevel(level) {
		return items[level].map((item) => (
			<div key={item.name}>
				<p>
					<strong>
						<Link
							href={`/library/${props.category}${
								props.subcategory ? `/${props.subcategory}/` : `/`
							}${item.uri}`}
						>
							<a className="link">{item.name}</a>
						</Link>
					</strong>
				</p>
			</div>
		));
	}

	return (
		<main>
			<section className={HeadStyle.head} id="head">
				{props.subcategory ? <h3>{props.category}</h3> : null}
				{props.data.subcategory ? (
					<h2>{props.data.subcategory}</h2>
				) : (
					<h2>{props.data.category}</h2>
				)}
				<p>{props.data.description}</p>
				<div className={HeadStyle.actionDiv}>
					<p>1</p>
					<p>2</p>
					<p>3</p>
				</div>
			</section>
			<section className="section1">{getLevel(0)}</section>
			<section className="section2">{getLevel(1)}</section>
			<section className="section3">{getLevel(2)}</section>
		</main>
	);
}

export default CategoryPage;
