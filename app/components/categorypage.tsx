import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import Card from './card';
import Share from './share';

import HeadStyle from '../styles/Head.module.css';

import favorite from '../public/favorite.svg';
import notfavorite from '../public/notfavorite.svg';
import shareIcon from '../public/share.png';

import { Category } from '../interfaces/db/Category';
import { Subcategory } from '../interfaces/db/Subcategory';

interface CategoryPageProps {
	categoryURI: string,
	data: Category
}

interface SubcategoryPageProps {
	categoryURI: string,
	subcategoryURI: string,
	data: Subcategory
}

function CategoryPage(props: CategoryPageProps | SubcategoryPageProps) {
	const [isFavorite, setIsFavorite] = useState(false);
	const [isShare, setIsShare] = useState(false);
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status !== 'authenticated') return;

		if (
			session.user.favorites.includes(
				`${'categoryURI' in props ? props.categoryURI : ''}${
					'subcategoryURI' in props ? `/${props.subcategoryURI}` : ''
				}`
			)
		)
			setIsFavorite(true);
	}, [props, session?.user.favorites, status]);

	const items = 'subcategories' in props.data ? props.data.subcategories : props.data.resources;
	function getLevel(level: number) {
		return items[level].map((item) => (
			<Card
				{...item}
				key={item.uri}
				category={'categoryURI' in props ? props.categoryURI : undefined}
				subcategory={'subcategoryURI' in props ? props.subcategoryURI : undefined}
			/>
		));
	}

	function handleFavorite() {
		if (status !== 'authenticated') {
			alert('You must be logged in to favorite something');
			return;
		}
		const FAVORITE_URL = `/api/user/favorite`;

		if (isFavorite) {
			axios
				.post(FAVORITE_URL, {
					uri: `${'categoryURI' in props ? props.categoryURI : ''}${
						'subcategoryURI' in props ? `/${props.subcategoryURI}` : ''
					}`,
				})
				.then(() => {
					setIsFavorite(false);
				});
		} else {
			axios
				.post(FAVORITE_URL, {
					uri: `${'categoryURI' in props ? props.categoryURI : ''}${
						'subcategoryURI' in props ? `/${props.subcategoryURI}` : ''
					}`,
				})
				.then(() => {
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
				{'subcategoryURI' in props ? (
					<h3>
						<Link href={`/library/${props.categoryURI}`}>
							<a className="link">{props.categoryURI}</a>
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
						/>
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
					/>
				</div>
			</section>
			<section className="section1">{getLevel(0)}</section>
			<section className="section2">{getLevel(1)}</section>
			<section className="section3">{getLevel(2)}</section>
		</main>
	);
}

export default CategoryPage;
