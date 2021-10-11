import HeadStyle from '../styles/Head.module.css';

function Library() {
	return (
		<main>
			<section className={HeadStyle.head} id="head">
				<h2>Resource Library</h2>
				<p>Browse foo resources in bar subjects</p>
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

export default Library;