import Image from 'next/image';

import profile from '../public/profile.png';

import type { RoadmapComment, ResourceComment, User } from '@prisma/client';

interface CommentProps {
	data: (RoadmapComment | ResourceComment) & { author: User };
}

function Comment(props: CommentProps) {
	return (
		<div className="m-2 flex w-full flex-row items-center justify-between rounded-md bg-gray-3 p-3">
			<div className="relative flex flex-col items-center justify-evenly">
				<Image
					src={props.data.author.image || profile}
					className="rounded-full bg-gray-400"
					width={40}
					height={40}
					alt="Profile picture"
					style={{
						maxWidth: '100%',
						height: 'auto',
					}}
				/>
				<p className="text-lg">{props.data.author.name}</p>
			</div>
			<div className="relative flex w-full flex-col items-center justify-center">
				<p className="h-full w-11/12 rounded-sm bg-gray-2 p-3 text-xl">
					{props.data.content}
				</p>
				<p className="text-md italic">
					Sent on {props.data.timestamp.toDateString()} at{' '}
					{props.data.timestamp.toTimeString()}
				</p>
			</div>
		</div>
	);
}

export default Comment;
