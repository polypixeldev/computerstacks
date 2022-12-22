import Link from 'next/link';
import Image from "next/image";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import Card from './card';
import Share from './share';
import { intoLevels } from '../util/intoLevels';
import { trpc } from '../util/trpc';

import HeadStyle from '../styles/Head.module.css';

import favorite from '../public/favorite.svg';
import notfavorite from '../public/notfavorite.svg';
import shareIcon from '../public/share.png';

import type { Category, Resource } from '@prisma/client';

interface CategoryPageProps {
	fullURI: string,
	categoryURI: string,
	data: Category & { categoryChildren: Category[], resourceChildren: Resource[], parent: Category | null }
}

function CategoryPage(props: CategoryPageProps) {
	const [isFavorite, setIsFavorite] = useState(false);
	const [isShare, setIsShare] = useState(false);
	const { data: session, status } = useSession();

	const favoriteMutation = trpc.user.favoriteCategory.useMutation();

	useEffect(() => {
		if (status !== 'authenticated') return;

		if (
			session.user.favoriteCategories.includes(props.categoryURI)
		)
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
				uri={`${props.fullURI}/${item.uri}`}
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
				uri={`${props.fullURI}/${item.uri}`}
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
			<section className={HeadStyle.head} id="head">
				{props.data.parent ? (
					<h3>
						<Link href={`/library/${props.data.parent.uri}`} className="link">
							{props.data.parent.name}
						</Link>
					</h3>
				) : null}
				<h2>{props.data.name}</h2>
				<p>{props.data.description}</p>
				<div className={HeadStyle.actionDiv}>
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
								name={props.data.name}
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
			</section>
			<section className="section1">{getLevel(0)}</section>
			<section className="section2">{getLevel(1)}</section>
			<section className="section3">{getLevel(2)}</section>
		</main>
	);
}

export default CategoryPage;
