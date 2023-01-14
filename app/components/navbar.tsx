import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useSpring, animated, config } from '@react-spring/web';

import Button from './button';
import Menu from './menu';

import OpenMenu from '../public/openMenu.png';
import CloseMenu from '../public/closeMenu.png';
import SearchIcon from '../public/search-white.png';

import { ChangeEvent, MouseEvent, KeyboardEvent } from 'react';

function Navbar() {
	const [query, setQuery] = useState('');
	const [menuOpen, setMenuOpen] = useState(false);

	const { status } = useSession();
	const router = useRouter();

	const [springs, api] = useSpring(() => ({
		from: {
			opacity: 0,
		},
		to: {
			opacity: 1,
		},
		config: {
			duration: 90,
		},
	}));

	useEffect(() => {
		menuOpen ? api.start({ opacity: 1 }) : api.start({ opacity: 0 });
	}, [menuOpen]);

	useEffect(() => {
		router.events.on('routeChangeStart', () => setMenuOpen(false));
		return () =>
			router.events.off('routeChangeStart', () => setMenuOpen(false));
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

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
		menuOpen ? setMenuOpen(false) : setMenuOpen(true);
	}

	return (
		<nav className="nav-grid-cols sticky top-0 z-20 grid h-min w-screen auto-rows-[0] grid-rows-1 items-center gap-1 bg-gray-4 p-3 opacity-95">
			<div>
				<div onClick={toggleMenu}>
					<Image
						src={menuOpen ? CloseMenu : OpenMenu}
						alt="menu button"
						height={40}
						width={40}
					/>
				</div>
				<div style={{ display: menuOpen ? 'inline' : 'none' }}>
					<animated.div className="relative" style={springs}>
						<Menu />
					</animated.div>
				</div>
			</div>
			<div className="relative hidden h-min flex-row items-center justify-between gap-2 rounded-sm border-2 border-gray-4 bg-gray-3 p-3 outline-0 md:flex">
				<Image
					onClick={handleSearch}
					height={25}
					width={25}
					src={SearchIcon}
					alt="search"
					className="searchIcon"
				/>
				<input
					type="search"
					autoComplete="on"
					name="query"
					placeholder="Browse our collection"
					value={query}
					onChange={handleChange}
					onKeyDown={handleSearch}
					className="text-md h-full w-full rounded-sm border-none bg-gray-1 p-2 font-zilla-slab text-white placeholder:text-gray-400"
				/>
			</div>
			<Link href="/">
				<h1 className="font-zilla-slab text-3xl">ComputerStacks</h1>
			</Link>
			<div className="hidden w-full sm:flex">
				{status !== 'authenticated' ? (
					<Button onClick={() => router.push('/login')}>Login</Button>
				) : (
					<Button onClick={() => router.push('/dashboard')}>
						<p className="text-xl">Dashboard</p>
					</Button>
				)}
			</div>
		</nav>
	);
}

export default Navbar;
