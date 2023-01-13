import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import Share from './share';
import Comment from './comment';
import LinkSvg from './linkSvg';
import { trpc } from '../util/trpc';

import shareIcon from '../public/share.png';
import profile from '../public/profile.png';
import favorite from '../public/favorite.svg';
import notfavorite from '../public/notfavorite.svg';

import { ChangeEvent } from 'react';

import type { Resource } from '@prisma/client';

interface ResourcePageProps {
	fullCategoryURI: string[];
	resourceURI: string;
	data: Resource;
}

function ResourcePage(props: ResourcePageProps) {
	const [isFavorite, setIsFavorite] = useState(false);
	const [comment, setComment] = useState('');
	const [isShare, setIsShare] = useState(false);
	const { data: session, status } = useSession();

	const favoriteMutation = trpc.user.favoriteResource.useMutation();
	const commentMutation = trpc.library.comment.useMutation();
	const getCommentsQuery = trpc.library.resourceComments.useQuery({
		uri: props.resourceURI,
	});
	const parentCategoryQuery = trpc.library.category.useQuery({
		uri: props.fullCategoryURI[props.fullCategoryURI.length - 1],
	});

	useEffect(() => {
		if (status !== 'authenticated') return;

		if (session.user.favoriteResources.includes(props.resourceURI))
			setIsFavorite(true);
	}, [session?.user.favoriteResources, status, props.resourceURI]);

	function handleFavorite() {
		if (status !== 'authenticated') {
			alert('You must be logged in to favorite something');
			return;
		}

		if (isFavorite) {
			favoriteMutation.mutateAsync({ uri: props.resourceURI }).then(() => {
				setIsFavorite(false);
			});
		} else {
			favoriteMutation.mutateAsync({ uri: props.resourceURI }).then(() => {
				setIsFavorite(true);
			});
		}
	}

	function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		if (name === 'comment') setComment(value);
	}

	function handleComment() {
		if (status !== 'authenticated') {
			alert('You must be logged in to comment');
			return;
		}

		commentMutation
			.mutateAsync({ uri: props.resourceURI, content: comment })
			.then(() => {
				setComment('');
				getCommentsQuery.refetch();
			});
	}

	function listComments() {
		if (!getCommentsQuery.data) return null;
		return getCommentsQuery.data.map((comment) => (
			<Comment key={comment.id} data={comment} />
		));
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
				<Link
					href={`/library/${props.fullCategoryURI.join('/')}`}
					className="font-dosis text-3xl text-gray-300 no-underline"
				>
					Category: {parentCategoryQuery.data?.name}
				</Link>
				<Link
					href={props.data.link}
					className="flex flex-row items-center justify-center text-4xl no-underline"
					target="_blank"
				>
					{props.data.name}
					<LinkSvg />
				</Link>
				<p className="font-open-sans text-2xl">{props.data.description}</p>
				<div className="flex flex-row items-center justify-center">
					<div className="relative">
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
						className="h-auto max-w-full"
					/>
				</div>
			</section>
			<section className="bg-gray-1">
				<h2 className="m-2 text-4xl">Comments</h2>
				<div className="w-1/2">
					<div className="relative flex w-full flex-row items-center justify-start rounded-md bg-gray-4 p-3">
						<Image
							src={session?.user?.image || profile}
							className="h-auto max-w-full rounded-full bg-gray-400"
							width={40}
							height={40}
							alt="Profile picture"
						/>
						<textarea
							className="m-2 h-16 w-full resize-none rounded-md p-3 text-black"
							name="comment"
							value={comment}
							onChange={handleChange}
						/>
						<button
							className="cursor-pointer rounded-md border-none bg-head-3 p-3 font-dosis text-lg text-white"
							onClick={handleComment}
						>
							Comment
						</button>
					</div>
					<div className="flex w-full flex-col items-center justify-center">
						{listComments()}
					</div>
				</div>
			</section>
		</main>
	);
}

export default ResourcePage;
