import FormStyle from "../styles/Form.module.css";
import HeadStyles from "../styles/Head.module.css";
import LoginStyles from "../styles/Login.module.css";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

function Login() {
	const router = useRouter();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [userEmail, setUserEmail] = useState("");

	useEffect(() => {
		getSession().then((session) => {
			if (session) router.push("/dashboard");
		});
	});

	function google(event) {
		event.preventDefault();
		signIn("google", { callbackUrl: "http://localhost/dashboard" });
	}

	function github(event) {
		event.preventDefault();
		signIn("github", { callbackUrl: "http://localhost/dashboard" });
	}

	function email(event) {
		event.preventDefault();
		signIn("email", {
			email: userEmail,
			callbackUrl: "http://localhost/dashboard",
		});
	}

	async function credentials(event) {
		event.preventDefault();
		const res = await signIn("credentials", {
			username: username,
			password: password,
			redirect: false,
		});
		const session = await getSession();

		if (res) {
			router.push("/dashboard");
		} else {
			alert("incorrect creds");
		}
	}

	function handleChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		if (name === "username") setUsername(value);
		if (name === "password") setPassword(value);
		if (name === "email") setUserEmail(value);
	}

	return (
		<main>
			<section className="section1">
				<h2>Login</h2>
				<br />
				<button
					onClick={google}
					className={`button ${LoginStyles.providerButton}`}
				>
					Sign in with Google
				</button>
				<br />
				<button
					onClick={github}
					className={`button ${LoginStyles.providerButton}`}
				>
					Sign in with GitHub
				</button>
				<div className={HeadStyles.actionDiv}>
					<hr />
					<p>OR</p>
					<hr />
				</div>
				<h3>Sign in with email</h3>
				<form className={FormStyle.form} onSubmit={email}>
					<label className={FormStyle.label}>
						Email
						<input
							type="email"
							autoComplete="email"
							name="email"
							value={userEmail}
							onChange={handleChange}
						/>
					</label>
					<br />
					<br />
					<button className={`button-small ${FormStyle.submit}`}>Login</button>
				</form>
				<div className={HeadStyles.actionDiv}>
					<hr />
					<p>OR</p>
					<hr />
				</div>
				<h3>Sign in with credentials</h3>
				<form className={FormStyle.form} onSubmit={credentials}>
					<label className={FormStyle.label}>
						Username
						<input
							type="text"
							autoComplete="username"
							name="username"
							value={username}
							onChange={handleChange}
						/>
					</label>
					<br />
					<br />
					<label className={FormStyle.label}>
						Password
						<input
							type="password"
							autoComplete="current-password"
							name="password"
							value={password}
							onChange={handleChange}
						/>
					</label>
					<br />
					<br />
					<button className={`button-small ${FormStyle.submit}`}>Login</button>
				</form>
			</section>
		</main>
	);
}

export default Login;
