import FormStyle from "../styles/Form.module.css";
import HeadStyles from "../styles/Head.module.css";
import LoginStyles from "../styles/Login.module.css";
import { signIn } from "next-auth/react";

function Login() {
	function google(){
		signIn('google', { callbackUrl: "http://localhost/dashboard"})
	}

	return (
		<main>
			<section className="section1">
				<h2>Login</h2>
				<br />
				<button onClick={google} className={`button ${LoginStyles.providerButton}`}>Sign in with Google</button>
				<div className={HeadStyles.actionDiv}>
					<hr />
					<p>OR</p>
					<hr/>
				</div>
				<h3>Sign in with email</h3>
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