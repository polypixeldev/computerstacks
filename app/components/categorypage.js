import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import Card from '../components/card';

import HeadStyle from '../styles/Head.module.css';

import favorite from '../public/favorite.svg';
import notfavorite from '../public/notfavorite.svg';

function CategoryPage(props) {
	const [isFavorite, setIsFavorite] = useState(false);
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status !== 'authenticated') return;

		console.log(
			`${props.category || ''}${
				props.subcategory ? `/${props.subcategory}` : ''
			}`
		);

		if (
			session.user.favorites.includes(
				`${props.category || ''}${
					props.subcategory ? `/${props.subcategory}` : ''
				}`
			)
		)
			setIsFavorite(true);
	}, [session?.user.favorites, status, props.category, props.subcategory]);

	const items = props.data.subcategories || props.data.resources;
	function getLevel(level) {
		return items[level].map((item) => (
			<Card
				{...item}
				key={item.uri}
				category={props.category}
				subcategory={props.subcategory}
			/>
		));
	}

	function handleFavorite() {
		const FAVORITE_URL = `/api/user/favorite`;

		if (isFavorite) {
			setIsFavorite(false);
			axios.post(FAVORITE_URL, {
				uri: `${props.category || ''}${
					props.subcategory ? `/${props.subcategory}` : ''
				}`,
			});
		} else {
			setIsFavorite(true);
			axios.post(FAVORITE_URL, {
				uri: `${props.category || ''}${
					props.subcategory ? `/${props.subcategory}` : ''
				}`,
			});
		}
	}

	return (
		<main>
			<section className={HeadStyle.head} id="head">
				{props.subcategory ? (
					<h3>
						<Link href={`/library/${props.category}`}>
							<a className="link">{props.category}</a>
						</Link>
					</h3>
				) : null}
				{props.data.subcategory ? (
					<h2>{props.data.subcategory}</h2>
				) : (
					<h2>{props.data.category}</h2>
				)}
				<p>{props.data.description}</p>
				<div className={HeadStyle.actionDiv}>
					<p>1</p>
					<Image
						onClick={handleFavorite}
						src={isFavorite ? favorite : notfavorite}
						alt="Favorite button"
						width={75}
						height={75}
					/>
					<p>3</p>
				</div>
			</section>
			<section className="section1">{getLevel(0)}</section>
			<section className="section2">{getLevel(1)}</section>
			<section className="section3">{getLevel(2)}</section>
		</main>
	);
}

export default CategoryPage;
