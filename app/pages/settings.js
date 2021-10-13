import HeadStyles from "../styles/Head.module.css";

function Settings() {
	return (
		<main>
			<section className={HeadStyles.head}>
				<h2>Settings</h2>
			</section>
			<section className="section1">
				<h2>Account</h2>
			</section>
			<section className="section2">
				<h2>Data</h2>
			</section>
		</main>
	)
}

export default Settings;