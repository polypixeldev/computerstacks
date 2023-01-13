import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';

import Button from '../components/button';

import { MouseEvent, ChangeEvent, FormEvent } from 'react';

function Login() {
	const router = useRouter();

	const [userEmail, setUserEmail] = useState('');

	useEffect(() => {
		getSession().then((session) => {
			if (session) router.push('/dashboard');
		});
	});

	function google(event: MouseEvent) {
		event.preventDefault();
		signIn('google', { callbackUrl: 'http://localhost/dashboard' });
	}

	function github(event: MouseEvent) {
		event.preventDefault();
		signIn('github', { callbackUrl: 'http://localhost/dashboard' });
	}

	function email(event: FormEvent) {
		event.preventDefault();
		signIn('email', {
			email: userEmail,
			callbackUrl: 'http://localhost/dashboard',
		});
	}

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		if (name === 'email') setUserEmail(value);
	}

	return (
		<main>
			<section className="bg-gray-1">
				<h2 className="text-4xl">Login</h2>
				<div className="flex flex-row items-center justify-center">
					<Button onClick={google}>Sign in with Google</Button>
					<Button onClick={github}>Sign in with GitHub</Button>
				</div>
				<div className="flex flex-row items-center justify-center">
					<p className="text-2xl">OR</p>
				</div>
				<h3 className="text-3xl">Sign in with email</h3>
				<form className="flex flex-col items-center justify-center">
					<label className="flex flex-col items-start justify-center text-xl">
						Email
						<input
							type="email"
							autoComplete="email"
							name="email"
							value={userEmail}
							onChange={handleChange}
							className="h-12 w-96 rounded-md border-none bg-input-light p-5 text-lg text-black"
						/>
					</label>

					<Button onClick={email}>Login</Button>
				</form>
			</section>
		</main>
	);
}

export default Login;
