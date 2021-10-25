import { useState } from 'react';

import HeadStyles from "../styles/Head.module.css";
import FormStyle from "../styles/Form.module.css";

function Settings() {
	let [ username, setUsername ] = useState('');
	let [ oldPassword, setOldPassword ] = useState('');
	let [ newPassword, setNewPassword ] = useState('');
	let [ confirmPassword, setConfirmPassword ] = useState('');
	
	function handleUsernameSubmit(event) {
		event.preventDefault();

	}

	function handlePasswordSubmit(event) {
		event.preventDefault();
		
	}

	function handleAccountDelete() {

	}

	function handleDataExport() {

	}

	function handleDataDelete() {

	}

	function handleChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		if(name === 'username') setUsername(value)
		if(name === 'oldPassword') setOldPassword(value)
		if(name === 'newPassword') setNewPassword(value)
		if(name === 'confirmPassword') setConfirmPassword(value)
	}

	return (
		<main>
			<section className={HeadStyles.head}>
				<h2>Settings</h2>
			</section>
			<section className="section1">
				<h2>Account</h2>
				<h3>Change Username</h3>
				<form className={FormStyle.form} onSubmit={handleUsernameSubmit}>
					<label>
						New Username:
						<input type="text" name="username" autoComplete="username" onChange={handleChange} value={username} />
					</label>
				</form>
				<br/>
				<h3>Change Username</h3>
				<form className={FormStyle.form} onSubmit={handlePasswordSubmit}>
					<label>
						Old Password:
						<input type="password" name="oldPassword" autoComplete="current-password" onChange={handleChange} value={oldPassword} />
					</label>
					<label>
						New Password:
						<input type="password" name="newPassword" autoComplete="new-password" onChange={handleChange} value={newPassword} />
					</label>
					<label>
						Confirm New Password:
						<input type="password" name="confirmPassword" autoComplete="new-password" onChange={handleChange} value={confirmPassword} />
					</label>
				</form>
				<br/>
				<button className="button" onClick={handleAccountDelete}>Delete Account</button>
			</section>
			<section className="section2">
				<h2>Data</h2>
				<button className="button" onClick={handleDataExport}>Export Data</button>
				<br />
				<button className="button" onClick={handleDataDelete}>Delete Data</button>
			</section>
		</main>
	)
}

export default Settings;