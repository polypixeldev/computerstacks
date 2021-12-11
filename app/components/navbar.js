import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import OpenMenu from '../public/openMenu.png';
import SearchIcon from '../public/search.png';
import CloseMenu from '../public/closeMenu.png';

function Navbar(props) {
	let [query, setQuery] = useState('');

	const { status } = useSession();
	const router = useRouter();

	function handleChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		if (name === 'query') setQuery(value);
	}

	function handleSearch(event) {
		if (event.key && event.key !== 'Enter') return;
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
					layout="fill"
					objectFit="contain"
					objectPosition="25% 50%"
				/>
			</div>
			<div className="search">
				<input
					type="search"
					autoComplete="on"
					name="query"
					placeholder="Browse our collection"
					value={query}
					onChange={handleChange}
					onKeyDown={handleSearch}
				/>
				<div>
					<div>
						<Image
							onClick={handleSearch}
							height={18}
							width={18}
							src={SearchIcon}
							alt="search"
							className="searchIcon"
						/>
					</div>
				</div>
			</div>
			<Link href="/">
				<a className="link">
					<h1>ComputerStacks</h1>
				</a>
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
