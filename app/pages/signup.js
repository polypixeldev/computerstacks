import FormStyle from "../styles/Form.module.css";

function Signup() {
	return (
		<main>
			<section className="section1">
				<h2>Create an Account</h2>
				<form className={FormStyle.form}>
					<label className={FormStyle.label}>
						Username
						<input type="text" autoComplete="username" name="username" />
					</label>
					<br />
					<br />
					<label className={FormStyle.label}>
						Password
						<input type="password" autoComplete="new-password" name="password" />
					</label>
					<br />
					<label className={FormStyle.label}>
						Confirm Password
						<input type="password" autoComplete="new-password" name="confirmPassword" />
					</label>
					<br />
					<br />
					<button className={`button ${FormStyle.submit}`}>Create</button>
				</form>
			</section>
		</main>
	)
}

export default Signup;