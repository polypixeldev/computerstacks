import { useState } from "react";

import HeadStyles from "../styles/Head.module.css";
import FormStyle from "../styles/Form.module.css";

function Settings() {
	function handleAccountDelete() {}

	function handleDataExport() {}

	function handleDataDelete() {}

	return (
		<main>
			<section className={HeadStyles.head}>
				<h2>Settings</h2>
			</section>
			<section className="section1">
				<h2>Account</h2>
				<button className="button-small" onClick={handleAccountDelete}>
					Delete Account
				</button>
			</section>
			<section className="section2">
				<h2>Data</h2>
				<button className="button-small" onClick={handleDataExport}>
					Export Data
				</button>
				<br />
				<button className="button-small" onClick={handleDataDelete}>
					Delete Data
				</button>
			</section>
		</main>
	);
}

export default Settings;
