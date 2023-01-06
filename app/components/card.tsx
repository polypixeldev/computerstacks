import Link from 'next/link';
import Image from "next/image";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import Share from './share';
import { trpc } from '../util/trpc';

import CardStyle from '../styles/Card.module.css';
import HeadStyle from '../styles/Head.module.css';

import favorite from '../public/favorite.svg';
import notfavorite from '../public/notfavorite.svg';
import shareIcon from '../public/share.png';

interface CardProps {
	key: string,
	noFavorite?: boolean,
	roadmap?: boolean,
	category?: boolean,
	resource?: boolean,
	path: string,
	name: string,
	description: string
};

function Card(props: CardProps) {
	const [isFavorite, setIsFavorite] = useState(false);
	const [isShare, setIsShare] = useState(false);
	const { data: session, status } = useSession();

	const favoriteCategoryMutation = trpc.user.favoriteCategory.useMutation();
	const favoriteResourceMutation = trpc.user.favoriteResource.useMutation();
	const roadmapMutation = trpc.user.roadmap.useMutation();

	useEffect(() => {
		if (status !== 'authenticated') return;
		if (props.noFavorite === true) return;
		if (!session.user) return;

		if (props.roadmap === true) {
			if (session.user.roadmaps.includes(props.path)) {
				setIsFavorite(true);
			}
		} else if (props.category === true) {
			if (session.user.favoriteCategories.includes(props.path)) {
				setIsFavorite(true);
			}
		} else {
			if (session.user.favoriteResources.includes(props.path)) {
				setIsFavorite(true);
			}
		}
	}, [
		session?.user,
		status,
		props.category,
		props.path,
		props.roadmap,
		props.noFavorite,
	]);

	function handleFavorite() {
		if (status !== 'authenticated') {
			alert('You must be logged in to favorite something');
			return;
		}

		if (props.roadmap === true) {
			if (isFavorite) {
				roadmapMutation.mutateAsync({ uri: props.path }).then(() => {
					setIsFavorite(false);
				});
			} else {
				roadmapMutation.mutateAsync({ uri: props.path }).then(() => {
					setIsFavorite(true);
				});
			}
		} else if (props.category == true) {
			if (isFavorite) {
				favoriteCategoryMutation.mutateAsync({ uri: props.path }).then(() => {
					setIsFavorite(false);
				});
			} else {
				favoriteCategoryMutation.mutateAsync({ uri: props.path }).then(() => {
					setIsFavorite(true);
				});
			}
		} else {
			if (isFavorite) {
				favoriteResourceMutation.mutateAsync({ uri: props.path }).then(() => {
					setIsFavorite(false);
				});
			} else {
				favoriteResourceMutation.mutateAsync({ uri: props.path }).then(() => {
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
						? `/roadmaps/${props.path}`
						: `/library/${props.path}`
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
									? `/roadmaps/${props.path}`
									: `/library/${props.path}`
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
