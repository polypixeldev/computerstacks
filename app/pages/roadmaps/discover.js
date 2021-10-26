import HeadStyles from "../../styles/Head.module.css";
import FormStyles from "../../styles/Form.module.css";

function Discover() {
	return (
		<main>
			<section className={HeadStyles.head}>
				<h2>Discover Your Roadmap</h2>
				<p>Take the quiz to find out your roadmap!</p>
			</section>
			<section className="section1">
				<h2>Question _</h2>
				<p>
					<em>Lorem ipsum dolor sit amet, consectetur?</em>
				</p>
				<form className={FormStyles.form}>
					<label className={FormStyles.checkboxLabel}>
						<input type="radio" name="answer" value="A" />
						A. Lorem ipsum dolor sit amet
					</label>
					<br />
					<label className={FormStyles.checkboxLabel}>
						<input type="radio" name="answer" value="B" />
						B. Lorem ipsum dolor sit amet
					</label>
					<br />
					<label className={FormStyles.checkboxLabel}>
						<input type="radio" name="answer" value="C" />
						C. Lorem ipsum dolor sit amet
					</label>
					<br />
					<label className={FormStyles.checkboxLabel}>
						<input type="radio" name="answer" value="D" />
						D. Lorem ipsum dolor sit amet
					</label>
					<br />
					<br />
					<button className={`button ${FormStyles.submit}`}>Next</button>
				</form>
			</section>
		</main>
	);
}

export default Discover;
