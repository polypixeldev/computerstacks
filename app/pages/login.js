import FormStyle from "../styles/Form.module.css";

function Login() {
	return (
		<main>
			<section className="section1">
				<h2>Login</h2>
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
					<br />
					<button className={`button ${FormStyle.submit}`}>Login</button>
				</form>
			</section>
		</main>
	)
}

export default Login;