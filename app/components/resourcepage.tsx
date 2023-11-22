import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import Share from './share';
import CommentSection from './commentsection';
import LinkSvg from './linkSvg';
import { trpc } from '../util/trpc';

import shareIcon from '../public/share.png';
import favorite from '../public/favorite.svg';
import notfavorite from '../public/notfavorite.svg';
import editIcon from '../public/edit.svg';

import type { Resource } from '@prisma/client';

interface ResourcePageProps {
	fullCategoryURI: string[];
	resourceURI: string;
	data: Resource;
}

function ResourcePage(props: ResourcePageProps) {
	const router = useRouter();

	const [isFavorite, setIsFavorite] = useState(false);
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

	const [comments, setComments] = useState(getCommentsQuery?.data);

	useEffect(() => {
		if (status !== 'authenticated') return;

		if (session.user.favoriteResources.includes(props.resourceURI))
			setIsFavorite(true);
	}, [session?.user.favoriteResources, status, props.resourceURI]);

	useEffect(() => {
		setComments(getCommentsQuery?.data);
	}, [getCommentsQuery?.data]);

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

	function addComment(comment: string) {
		if (status !== 'authenticated') {
			alert('You must be logged in to comment');
			return;
		}

		commentMutation
			.mutateAsync({
				uri: props.resourceURI,
				content: comment,
			})
			.then(reloadComments);
	}

	async function reloadComments() {
		await getCommentsQuery.refetch();

		setComments(getCommentsQuery?.data);
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
					{session?.user?.isAdmin && (
						<Image
							onClick={() => {
								router.push(
									`/editor?path=${props.fullCategoryURI}&resource=${props.resourceURI}`
								);
							}}
							src={editIcon}
							alt="Edit Icon"
							width={50}
							height={50}
							className="h-auto max-w-full cursor-pointer"
						/>
					)}
				</div>
			</section>
			<CommentSection
				comments={comments}
				userImage={session?.user.image}
				addComment={addComment}
			/>
		</main>
	);
}

export default ResourcePage;
