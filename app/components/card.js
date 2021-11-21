import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import CardStyle from '../styles/Card.module.css';
import HeadStyle from '../styles/Head.module.css';

import favorite from '../public/favorite.svg';
import notfavorite from '../public/notfavorite.svg';

function Card(props) {
	const [isFavorite, setIsFavorite] = useState(false);
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status !== 'authenticated') return;

		if (
			session.user.favorites.includes(
				`${props.category ? `${props.category}/` : ''}${
					props.subcategory ? `${props.subcategory}/` : ''
				}${props.uri}`
			)
		)
			setIsFavorite(true);
	}, [
		session?.user.favorites,
		status,
		props.category,
		props.subcategory,
		props.uri,
	]);

	function handleFavorite() {
		const FAVORITE_URL = `/api/user/favorite`;

		if (isFavorite) {
			setIsFavorite(false);
			axios.post(FAVORITE_URL, {
				uri: `${props.category ? `${props.category}/` : ''}${
					props.subcategory ? `${props.subcategory}/` : ''
				}${props.uri}`,
			});
		} else {
			setIsFavorite(true);
			axios.post(FAVORITE_URL, {
				uri: `${props.category ? `${props.category}/` : ''}${
					props.subcategory ? `${props.subcategory}/` : ''
				}${props.uri}`,
			});
		}
	}

	return (
		<div className={CardStyle.card}>
			<Link
				href={`/library/${props.category ? `${props.category}/` : ''}${
					props.subcategory ? `${props.subcategory}/` : ''
				}${props.uri}`}
			>
				<a className="link">
					<div>
						<p className={CardStyle.name}>{props.name}</p>
						<p className={CardStyle.desc}>{props.description}</p>
					</div>
				</a>
			</Link>
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
		</div>
	);
}

export default Card;
