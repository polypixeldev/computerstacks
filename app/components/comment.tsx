import Image from 'next/image';

import CommentStyle from '../styles/Comment.module.css';

import profile from '../public/profile.png';

import type { RoadmapComment, ResourceComment, User } from '@prisma/client';

interface CommentProps {
	data: (RoadmapComment | ResourceComment) & { author: User };
}

function Comment(props: CommentProps) {
	return (
		<div className={CommentStyle.comment}>
			<div className={CommentStyle.inner}>
				<Image
					src={props.data.author.image || profile}
					className={CommentStyle.authorImg}
					width={40}
					height={40}
					alt="Profile picture"
					style={{
						maxWidth: '100%',
						height: 'auto',
					}}
				/>
				<p>{props.data.author.name}</p>
			</div>
			<div className={CommentStyle.inner}>
				<p className={CommentStyle.commentText}>{props.data.content}</p>
				<p className={CommentStyle.timestamp}>
					Sent on {props.data.timestamp.toDateString()} at{' '}
					{props.data.timestamp.toTimeString()}
				</p>
			</div>
		</div>
	);
}

export default Comment;
