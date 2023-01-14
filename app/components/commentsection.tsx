import Image from 'next/image';
import { useState } from 'react';

import Comment from './comment';
import Button from './button';
import profile from '../public/profile.png';

import type { ResourceComment, RoadmapComment, User } from '@prisma/client';

interface CommentSectionProps {
	comments?: ((RoadmapComment | ResourceComment) & { author: User })[];
	addComment: (comment: string) => void;
	userImage?: string | null;
}

function CommentSection(props: CommentSectionProps) {
	const [comment, setComment] = useState('');

	function listComments() {
		if (!props.comments) return null;
		return props.comments.map((comment) => (
			<Comment key={comment.id} data={comment} />
		));
	}

	function handleComment() {
		if (!comment) return;
		props.addComment(comment);

		setComment('');
	}

	return (
		<section className="bg-gray-2">
			<h2 className="m-2 text-4xl">Comments</h2>
			<div className="w-3/4 md:w-1/2">
				<div className="relative flex w-full flex-row flex-wrap items-center justify-center rounded-md bg-gray-4 p-3 md:flex-nowrap md:justify-start">
					<Image
						src={props.userImage || profile}
						width={40}
						height={40}
						alt="Profile picture"
						className="h-auto max-w-full rounded-full bg-gray-400"
					/>
					<textarea
						className="m-2 h-16 w-full resize-none rounded-md p-3 text-black"
						name="comment"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
					<div className="centered w-full md:w-1/2">
						<Button onClick={handleComment}>Comment</Button>
					</div>
				</div>
				<div className="flex w-full flex-col items-center justify-center">
					{listComments()}
				</div>
			</div>
		</section>
	);
}

export default CommentSection;
