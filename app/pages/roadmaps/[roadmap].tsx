import Image from 'next/image';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';

import Loading from '../../components/loading';
import Share from '../../components/share';
import { appRouter } from '../../server/routers/_app';
import { intoLevels } from '../../util/intoLevels';
import { trpc } from '../../util/trpc';

import CommentSection from '../../components/commentsection';

import notroadmap from '../../public/notfavorite.svg';

import roadmap from '../../public/favorite.svg';
import shareIcon from '../../public/share.png';

function Roadmap() {
	const router = useRouter();
	const { data: session, status } = useSession();

	const uri =
		typeof router.query.roadmap !== 'string' ? '' : router.query.roadmap;

	const roadmapsQuery = trpc.roadmaps.roadmap.useQuery({ uri });
	const commentMutation = trpc.roadmaps.comment.useMutation();
	const roadmapMutation = trpc.user.roadmap.useMutation();

	const [isRoadmap, setIsRoadmap] = useState(false);

	const [comments, setComments] = useState(roadmapsQuery?.data?.comments);
	const [isShare, setIsShare] = useState(false);

	useEffect(() => {
		if (status !== 'authenticated') return;

		if (!router.query.roadmap || typeof router.query.roadmap === 'object') {
			throw new Error(`Invalid roadmap URI ${router.query.roadmap}`);
		}

		if (session.user.roadmaps.includes(router.query.roadmap))
			setIsRoadmap(true);
	}, [session?.user.roadmaps, status, router.query.roadmap]);

	useEffect(() => {
		setComments(roadmapsQuery?.data?.comments);
	}, [roadmapsQuery?.data?.comments]);

	if (router.isFallback) return <Loading />;

	function handleRoadmap() {
		if (status !== 'authenticated') {
			alert('You must be logged in to add a roadmap');
			return;
		}

		if (isRoadmap) {
			roadmapMutation.mutateAsync({ uri }).then(() => {
				setIsRoadmap(false);
			});
		} else {
			roadmapMutation.mutateAsync({ uri }).then(() => {
				setIsRoadmap(true);
			});
		}
	}

	async function reloadComments() {
		await roadmapsQuery.refetch();

		setComments(roadmapsQuery?.data?.comments);
	}

	function addComment(comment: string) {
		if (status !== 'authenticated') {
			alert('You must be logged in to comment');
			return;
		}

		commentMutation
			.mutateAsync({
				uri:
					typeof router.query.roadmap !== 'string' ? '' : router.query.roadmap,
				content: comment,
			})
			.then(reloadComments);
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
			<section className="bg-head-3">
				<h2 className="text-5xl">{roadmapsQuery.data?.name}</h2>
				<p className="text-3xl">{roadmapsQuery.data?.description}</p>
				<div className="flex flex-row items-center justify-center">
					<div className="relative">
						<Image
							onClick={handleShare}
							src={shareIcon}
							alt="Share Icon"
							width={50}
							height={50}
							className="h-auto max-w-full"
						/>
						{isShare ? (
							<Share
								name={roadmapsQuery.data?.name ?? ''}
								toggle={handleShare}
							/>
						) : null}
					</div>
					<Image
						onClick={handleRoadmap}
						src={isRoadmap ? roadmap : notroadmap}
						alt="Favorite button"
						width={75}
						height={75}
						className="h-auto max-w-full"
					/>
				</div>
			</section>
			<section className="h-screen w-full bg-gray-1 p-5">
				<div className="relative h-full w-full">
					<Image src={roadmapsQuery.data?.image ?? ''} fill alt="The roadmap" />
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

async function getStaticPaths() {
	const res = {
		paths: new Array<{ params: { roadmap: string } }>(),
		fallback: true,
	};

	const caller = appRouter.createCaller({ session: null });

	const data = await caller.roadmaps.meta();

	if (!data) return res;

	const levels = intoLevels(data.roadmaps);

	for (const level of levels) {
		for (const roadmap of level)
			res.paths.push({ params: { roadmap: roadmap.uri } });
	}

	return res;
}

const getStaticProps: GetStaticProps = async ({ params }) => {
	if (!params) {
		throw Error('Category page parameters not found');
	}

	if (!params.roadmap || typeof params.roadmap === 'object') {
		throw Error(`Invalid roadmap URI ${params.roadmap}`);
	}

	const ssg = await createServerSideHelpers({
		router: appRouter,
		ctx: {
			session: null,
		},
		transformer: superjson,
	});

	await ssg.roadmaps.roadmap.prefetch({ uri: params.roadmap });

	return {
		revalidate: 86400,
		props: {
			trpcState: ssg.dehydrate(),
		},
	};
};

export { getStaticPaths, getStaticProps };

export default Roadmap;
