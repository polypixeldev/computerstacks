import HeadStyle from "../styles/Head.module.css";
import Link from "next/link";
import styles from "../styles/Resource.module.css";

function ResourcePage(props) {
	return (
		<main>
			<section className={HeadStyle.head} id="head">
				<h4>
					<Link href={`/library/${props.category}`}>
						<a className={`link ${styles.category}`}>{props.category}</a>
					</Link>
				</h4>
				<h3>
					<Link href={`/library/${props.category}/${props.subcategory}`}>
						<a className={`link ${styles.subcategory}`}>{props.subcategory}</a>
					</Link>
				</h3>
				<h2>
					<Link href={props.data.link}>
						<a className="link">{props.data.name}</a>
					</Link>
				</h2>
				<p>{props.data.description}</p>
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
	);
}

export default ResourcePage;
