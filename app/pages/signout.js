import { useState } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

function Signout() {
	const [signedOut, setSignedOut] = useState(false);
	const router = useRouter();

	signOut({ redirect: false }).then((data) => {
		setSignedOut(true);
		setTimeout(() => {
			router.push('/login');
		}, 2000);
	});

	return (
		<main>
			<section className="section1">
				{signedOut ? <h2>See you back soon!</h2> : <h2>Signing you out...</h2>}
			</section>
		</main>
	);
}

export default Signout;
