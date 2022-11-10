import axios from 'axios';
import Link from 'next/link';
import Image from "next/image";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import Share from './share';

import CardStyle from '../styles/Card.module.css';
import HeadStyle from '../styles/Head.module.css';

import favorite from '../public/favorite.svg';
import notfavorite from '../public/notfavorite.svg';
import shareIcon from '../public/share.png';

interface CardProps {
	key: string,
	noFavorite?: boolean,
	roadmap?: boolean,
	uri: string,
	category?: string,
	subcategory?: string,
	name: string,
	description: string
};

function Card(props: CardProps) {
	const [isFavorite, setIsFavorite] = useState(false);
	const [isShare, setIsShare] = useState(false);
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status !== 'authenticated') return;
		if (props.noFavorite === true) return;
		if (!session.user) return;

		if (props.roadmap === true) {
			if (session.user.roadmaps.includes(props.uri)) {
				setIsFavorite(true);
			}
		} else {
			if (
				session.user.favorites.includes(
					`${props.category ? `${props.category}/` : ''}${
						props.subcategory ? `${props.subcategory}/` : ''
					}${props.uri}`
				)
			) {
				setIsFavorite(true);
			}
		}
	}, [
		session?.user,
		status,
		props.category,
		props.subcategory,
		props.uri,
		props.roadmap,
		props.noFavorite,
	]);

	function handleFavorite() {
		if (status !== 'authenticated') {
			alert('You must be logged in to favorite something');
			return;
		}

		if (props.roadmap === true) {
			const ROADMAP_URL = `/api/user/roadmap`;

			if (isFavorite) {
				axios
					.post(ROADMAP_URL, {
						uri: props.uri,
					})
					.then(() => {
						setIsFavorite(false);
					});
			} else {
				axios
					.post(ROADMAP_URL, {
						uri: props.uri,
					})
					.then(() => {
						setIsFavorite(true);
					});
			}
		} else {
			const FAVORITE_URL = `/api/user/favorite`;

			if (isFavorite) {
				axios
					.post(FAVORITE_URL, {
						uri: `${props.category ? `${props.category}/` : ''}${
							props.subcategory ? `${props.subcategory}/` : ''
						}${props.uri}`,
					})
					.then(() => {
						setIsFavorite(false);
					});
			} else {
				axios
					.post(FAVORITE_URL, {
						uri: `${props.category ? `${props.category}/` : ''}${
							props.subcategory ? `${props.subcategory}/` : ''
						}${props.uri}`,
					})
					.then(() => {
						setIsFavorite(true);
					});
			}
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
                href={
					props.roadmap
						? `/roadmaps/${props.uri}`
						: `/library/${props.category ? `${props.category}/` : ''}${
								props.subcategory ? `${props.subcategory}/` : ''
						  }${props.uri}`
				}
                className="link">

                <div>
                    <p className={CardStyle.name}>{props.name}</p>
                    <p className={CardStyle.desc}>{props.description}</p>
                </div>

            </Link>
			<div className={`${HeadStyle.actionDiv} ${CardStyle.side}`}>
				<div style={{ position: 'relative' }}>
					<Image
                        onClick={handleShare}
                        src={shareIcon}
                        alt="Share Icon"
                        width={50}
                        height={50}
                        style={{
                            maxWidth: "100%",
                            height: "auto"
                        }} />
					{isShare ? (
						<Share
							href={
								props.roadmap
									? `/roadmaps/${props.uri}`
									: `/library/${props.category ? `${props.category}/` : ''}${
											props.subcategory ? `${props.subcategory}/` : ''
									  }${props.uri}`
							}
							name={props.name}
							toggle={handleShare}
						/>
					) : null}
				</div>
				<Image
                    onClick={handleFavorite}
                    src={isFavorite ? favorite : notfavorite}
                    alt="Favorite button"
                    width={75}
                    height={75}
                    style={{
                        maxWidth: "100%",
                        height: "auto"
                    }} />
			</div>
		</div>
    );
}

export default Card;
