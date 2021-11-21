import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import Share from './share';

import CardStyle from '../styles/Card.module.css';
import HeadStyle from '../styles/Head.module.css';

import favorite from '../public/favorite.svg';
import notfavorite from '../public/notfavorite.svg';
import shareIcon from '../public/share.png';

function Card(props) {
	const [isFavorite, setIsFavorite] = useState(false);
	const [isShare, setIsShare] = useState(false);
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

	function handleShare() {
		if (isShare) {
			setIsShare(false);
		} else {
			setIsShare(true);
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
				<div style={{ position: 'relative' }}>
					<Image
						onClick={handleShare}
						src={shareIcon}
						alt="Share Icon"
						width={50}
						height={50}
					/>
					{isShare ? <Share name={props.name} toggle={handleShare} /> : null}
				</div>
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
