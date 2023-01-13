import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

import Button from '../components/button';

import { trpc } from '../util/trpc';

function Settings() {
	const [modal, setModal] = useState(false);
	const [runExport, setRunExport] = useState(false);
	const router = useRouter();

	const exportQuery = trpc.data.export.useQuery(undefined, {
		enabled: runExport,
	});

	const deleteMutation = trpc.data.delete.useMutation();

	useEffect(() => {
		if (exportQuery.data && runExport) {
			alert(`Your data is: ${JSON.stringify(exportQuery.data)}`);
			setRunExport(false);
		}
	}, [exportQuery.data, runExport]);

	async function handleDataExport() {
		setRunExport(true);
	}

	async function handleDataDelete() {
		await deleteMutation.mutateAsync();

		await signOut({ redirect: false });

		router.push('/login');
	}

	function handleModal() {
		setModal(!modal);
	}

	return (
		<main>
			<section className="bg-head-3">
				<h2 className="text-5xl">Settings</h2>
			</section>
			<section className="bg-gray-2">
				<h2 className="text-2xl">Data</h2>
				<div className="flex flex-row items-center justify-center">
					<Button onClick={handleDataExport}>Export Data</Button>
					<br />
					<Button onClick={handleModal}>Delete Data</Button>
				</div>
			</section>
			<div
				className="fixed top-1/3 left-1/4 right-1/4 bottom-1/3 h-1/3 w-1/2 flex-col items-center justify-center rounded-sm border-2 border-gray-2 bg-gray-3"
				style={{ display: modal ? 'flex' : 'none' }}
			>
				<p className="text-2xl">
					Are you sure you want to delete all of your data?{' '}
					<strong className="font-bold">This is irreversible!</strong>
				</p>
				<div className="flex flex-row items-center justify-between">
					<Button onClick={handleDataDelete}>Yes, DELETE my data.</Button>
					<Button onClick={handleModal}>No, save my data!</Button>
				</div>
			</div>
		</main>
	);
}

export default Settings;
