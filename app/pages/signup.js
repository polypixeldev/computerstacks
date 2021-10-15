import FormStyle from "../styles/Form.module.css";
import { useState } from 'react';
import axios from 'axios'
import { useRouter } from 'next/router';

function Signup() {
	const router = useRouter();

	let [ username, setUsername ] = useState('');
	let [ password, setPassword ] = useState('');
	let [ confirmPassword, setConfirmPassword ] = useState('');

	function submit(event){
		event.preventDefault();

		if(password !== confirmPassword) return alert('The passwords do not match. Try again.')

		axios.post('/api/auth/create', {
			username,
			password
		})
		.then(() => {
			router.push('/login');
		})
		.catch(() => {
			alert("There was an error. Try again.")
		})
	}

	function handleChange(event){
		const target = event.target;
		const value = target.value;
		const name = target.name;

		if(name === 'username') setUsername(value)
		if(name === 'password') setPassword(value)
		if(name === 'confirmPassword') setConfirmPassword(value)
	}

	return (
		<main>
			<section className="section1">
				<h2>Create an Account</h2>
				<form className={FormStyle.form} onSubmit={submit}>
					<label className={FormStyle.label}>
						Username
						<input type="text" autoComplete="username" name="username" value={username} onChange={handleChange} />
					</label>
					<br />
					<br />
					<label className={FormStyle.label}>
						Password
						<input type="password" autoComplete="new-password" name="password" value={password} onChange={handleChange} />
					</label>
					<br />
					<label className={FormStyle.label}>
						Confirm Password
						<input type="password" autoComplete="new-password" name="confirmPassword" value={confirmPassword} onChange={handleChange} />
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