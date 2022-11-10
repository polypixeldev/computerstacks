import Image from "next/legacy/image";

import CommentStyle from '../styles/Comment.module.css';

import profile from '../public/profile.png';

import User from '../interfaces/db/User';

interface CommentProps {
	data: {
		timestamp: string,
		author: User
		content: string
	}
};

function Comment(props: CommentProps) {
	const time = new Date(props.data.timestamp);
	return (
		<div className={CommentStyle.comment}>
			<div className={CommentStyle.inner}>
				<Image
					src={props.data.author.image || profile}
					className={CommentStyle.authorImg}
					width={40}
					height={40}
					alt="Profile picture"
				/>
				<p>{props.data.author.name}</p>
			</div>
			<div className={CommentStyle.inner}>
				<p className={CommentStyle.commentText}>{props.data.content}</p>
				<p className={CommentStyle.timestamp}>
					Sent on {time.toDateString()} at {time.toTimeString()}
				</p>
			</div>
		</div>
	);
}

export default Comment;
