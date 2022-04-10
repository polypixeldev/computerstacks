import CheckEmailStyles from "../styles/CheckEmail.module.css";

function CheckEmail() {
	return (
		<main>
			<section className="section1 top">
				<div className={CheckEmailStyles.centerBox}>
					<h1><strong>Check your email</strong></h1>
					<p>A sign in link has been sent to your email address</p>
				</div>
			</section>
		</main>
	)
}

export default CheckEmail;
