import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import OpenMenu from '../public/openMenu.png';
import CloseMenu from '../public/closeMenu.png';

import {
	ChangeEvent,
	MouseEvent,
	KeyboardEvent,
	Dispatch,
	SetStateAction,
} from 'react';

interface NavbarProps {
	menuOpen: boolean;
	setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

function Navbar(props: NavbarProps) {
	const [query, setQuery] = useState('');

	const { status } = useSession();
	const router = useRouter();

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		if (name === 'query') setQuery(value);
	}

	function handleSearch(event: MouseEvent | KeyboardEvent) {
		if ('key' in event && event.key !== 'Enter') return;
		setQuery('');
		router.push(`/search?query=${query}`);
	}

	function toggleMenu() {
		props.menuOpen ? props.setMenuOpen(false) : props.setMenuOpen(true);
	}

	return (
		<nav>
			<div className="imageWrap" onClick={toggleMenu}>
				<Image
					src={props.menuOpen ? CloseMenu : OpenMenu}
					alt="menu button"
					fill
					sizes="100vw"
					style={{
						objectFit: 'contain',
						objectPosition: '25% 50%',
					}}
				/>
			</div>
			<div className="search">
				<svg
					onClick={handleSearch}
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 40 40"
				>
					<path d="M26.804 29.01c-2.832 2.34-6.465 3.746-10.426 3.746C7.333 32.756 0 25.424 0 16.378 0 7.333 7.333 0 16.378 0c9.046 0 16.378 7.333 16.378 16.378 0 3.96-1.406 7.594-3.746 10.426l10.534 10.534c.607.607.61 1.59-.004 2.202-.61.61-1.597.61-2.202.004L26.804 29.01zm-10.426.627c7.323 0 13.26-5.936 13.26-13.26 0-7.32-5.937-13.257-13.26-13.257C9.056 3.12 3.12 9.056 3.12 16.378c0 7.323 5.936 13.26 13.258 13.26z"></path>
				</svg>
				<input
					type="search"
					autoComplete="on"
					name="query"
					placeholder="Browse our collection"
					value={query}
					onChange={handleChange}
					onKeyDown={handleSearch}
				/>
			</div>
			<Link href="/" className="link">
				<h1>ComputerStacks</h1>
			</Link>
			{status !== 'authenticated' ? (
				<button
					className="button-small"
					id="login"
					onClick={() => router.push('/login')}
				>
					Login
				</button>
			) : (
				<button
					className="button-small"
					id="login"
					onClick={() => router.push('/dashboard')}
				>
					Dashboard
				</button>
			)}
		</nav>
	);
}

export default Navbar;
