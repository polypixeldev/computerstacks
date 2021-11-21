import HeadStyles from '../styles/Head.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

function Settings() {
	const router = useRouter();

	async function handleDataExport() {
		const DATA_EXPORT_URL = `/api/data/export`;
		const data = await axios.get(DATA_EXPORT_URL);

		alert(`Your data is: ${JSON.stringify(data.data)}`);
	}

	async function handleDataDelete() {
		const DATA_DELETE_URL = `/api/data/delete`;
		await axios.post(DATA_DELETE_URL);

		await signOut({ redirect: false });

		router.push('/login');
	}

	return (
		<main>
			<section className={HeadStyles.head}>
				<h2>Settings</h2>
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
