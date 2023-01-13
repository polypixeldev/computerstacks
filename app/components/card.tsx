import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import Share from './share';
import { trpc } from '../util/trpc';

import favorite from '../public/favorite.svg';
import notfavorite from '../public/notfavorite.svg';
import shareIcon from '../public/share.png';

interface CardProps {
	key?: string;
	noFavorite?: boolean;
	roadmap?: boolean;
	category?: boolean;
	resource?: boolean;
	path?: string;
	uri: string;
	name: string;
	description: string;
}

function Card(props: CardProps) {
	const [isFavorite, setIsFavorite] = useState(false);
	const [isShare, setIsShare] = useState(false);
	const { data: session, status } = useSession();

	const favoriteCategoryMutation = trpc.user.favoriteCategory.useMutation();
	const favoriteResourceMutation = trpc.user.favoriteResource.useMutation();
	const roadmapMutation = trpc.user.roadmap.useMutation();

	const resourceQuery = trpc.library.resource.useQuery(
		{ uri: props.uri },
		{ enabled: props.resource === true && !props.path }
	);
	const categoryPathQuery = trpc.library.getFullCategoryPath.useQuery(
		{ uri: props.uri },
		{ enabled: props.category === true && !props.path }
	);
	const resourcePathQuery = trpc.library.getFullCategoryPath.useQuery(
		{ uri: resourceQuery.data?.parentId ?? '' },
		{ enabled: !!resourceQuery.data }
	);

	useEffect(() => {
		if (status !== 'authenticated') return;
		if (props.noFavorite === true) return;
		if (!session.user) return;

		if (props.roadmap === true) {
			if (session.user.roadmaps.includes(props.uri)) {
				setIsFavorite(true);
			}
		} else if (props.category === true) {
			if (session.user.favoriteCategories.includes(props.uri)) {
				setIsFavorite(true);
			}
		} else {
			if (session.user.favoriteResources.includes(props.uri)) {
				setIsFavorite(true);
			}
		}
	}, [
		session?.user,
		status,
		props.category,
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
			if (isFavorite) {
				roadmapMutation.mutateAsync({ uri: props.uri }).then(() => {
					setIsFavorite(false);
				});
			} else {
				roadmapMutation.mutateAsync({ uri: props.uri }).then(() => {
					setIsFavorite(true);
				});
			}
		} else if (props.category == true) {
			if (isFavorite) {
				favoriteCategoryMutation.mutateAsync({ uri: props.uri }).then(() => {
					setIsFavorite(false);
				});
			} else {
				favoriteCategoryMutation.mutateAsync({ uri: props.uri }).then(() => {
					setIsFavorite(true);
				});
			}
		} else {
			if (isFavorite) {
				favoriteResourceMutation.mutateAsync({ uri: props.uri }).then(() => {
					setIsFavorite(false);
				});
			} else {
				favoriteResourceMutation.mutateAsync({ uri: props.uri }).then(() => {
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

	const path = props.path
		? props.path
		: props.resource
		? `${resourcePathQuery.data?.join('/')}/${props.uri}`
		: categoryPathQuery.data?.join('/');

	return (
		<div className="card-grid-cols m-2 grid h-1/5 w-3/5 items-center gap-1 overflow-x-clip overflow-y-scroll rounded-md border-2 border-black bg-card p-3 shadow-md shadow-black">
			<Link
				href={props.roadmap ? `/roadmaps/${props.uri}` : `/library/${path}`}
			>
				<div>
					<p className="font-dosis text-3xl">{props.name}</p>
					<p className="font-dosis text-2xl">{props.description}</p>
				</div>
			</Link>
			<div className="flex flex-row items-center justify-center p-3">
				<div className="relative">
					<Image
						onClick={handleShare}
						src={shareIcon}
						alt="Share Icon"
						width={50}
						height={50}
					/>
					{isShare ? (
						<Share
							href={
								props.roadmap ? `/roadmaps/${props.uri}` : `/library/${path}`
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
						maxWidth: '100%',
						height: 'auto',
					}}
				/>
			</div>
		</div>
	);
}

export default Card;
