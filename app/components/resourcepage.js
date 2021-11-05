import HeadStyle from "../styles/Head.module.css";

function ResourcePage(props) {
	return (
		<main>
			<section className={HeadStyle.head} id="head">
				<h4>{props.data.category}</h4>
				{(() => {
					if (typeof props.data.subcategory !== "undefined")
						return <h3>{props.data.subcategory}</h3>;
				})()}
				<h2>{props.data.name}</h2>
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
