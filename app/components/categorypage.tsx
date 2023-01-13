import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import Card from './card';
import Share from './share';
import { intoLevels } from '../util/intoLevels';
import { trpc } from '../util/trpc';

import favorite from '../public/favorite.svg';
import notfavorite from '../public/notfavorite.svg';
import shareIcon from '../public/share.png';

import type { Category, Resource } from '@prisma/client';

interface CategoryPageProps {
	fullURI: string;
	categoryURI: string;
	data: Category & {
		categoryChildren: Category[];
		resourceChildren: Resource[];
		parent: Category | null;
	};
}

function CategoryPage(props: CategoryPageProps) {
	const [isFavorite, setIsFavorite] = useState(false);
	const [isShare, setIsShare] = useState(false);
	const { data: session, status } = useSession();

	const favoriteMutation = trpc.user.favoriteCategory.useMutation();

	useEffect(() => {
		if (status !== 'authenticated') return;

		if (session.user.favoriteCategories.includes(props.categoryURI))
			setIsFavorite(true);
	}, [props, session?.user.favoriteCategories, status]);

	function getLevel(level: number) {
		const categoryLevels = intoLevels(props.data.categoryChildren);
		const resourceLevels = intoLevels(props.data.resourceChildren);

		const categoryCards = categoryLevels[level].map((item) => (
			<Card
				{...item}
				key={item.uri}
				category={true}
				path={`${props.fullURI}/${item.uri}`}
				uri={item.uri}
				resource={false}
				description={item.description}
				name={item.name}
				roadmap={false}
			/>
		));
		const resourceCards = resourceLevels[level].map((item) => (
			<Card
				{...item}
				key={item.uri}
				category={false}
				path={`${props.fullURI}/${item.uri}`}
				uri={item.uri}
				resource={true}
				description={item.description}
				name={item.name}
				roadmap={false}
			/>
		));
		return [...categoryCards, ...resourceCards];
	}

	function handleFavorite() {
		if (status !== 'authenticated') {
			alert('You must be logged in to favorite something');
			return;
		}

		if (isFavorite) {
			favoriteMutation.mutateAsync({ uri: props.categoryURI }).then(() => {
				setIsFavorite(false);
			});
		} else {
			favoriteMutation.mutateAsync({ uri: props.categoryURI }).then(() => {
				setIsFavorite(true);
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
		<main>
			<section className="bg-head-3" id="head">
				{props.data.parent ? (
					<Link
						href={`/library/${props.data.parent.uri}`}
						className="mb-1 font-dosis text-3xl text-gray-300 no-underline"
					>
						Category: {props.data.parent.name}
					</Link>
				) : null}
				<h2 className="mb-1 text-5xl">{props.data.name}</h2>
				<p className="text-2xl">{props.data.description}</p>
				<div className="flex flex-row items-center justify-center">
					<div style={{ position: 'relative' }}>
						<Image
							onClick={handleShare}
							src={shareIcon}
							alt="Share Icon"
							width={50}
							height={50}
							style={{
								maxWidth: '100%',
								height: 'auto',
							}}
						/>
						{isShare ? (
							<Share name={props.data.name} toggle={handleShare} />
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
			</section>
			<section className="bg-gray-1">{getLevel(0)}</section>
			<section className="bg-gray-2">{getLevel(1)}</section>
			<section className="bg-gray-3">{getLevel(2)}</section>
		</main>
	);
}

export default CategoryPage;
