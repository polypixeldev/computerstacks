import axios from 'axios';
import Link from 'next/link';
import Image from "next/image";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import Share from './share';
import Comment from './comment';

import HeadStyle from '../styles/Head.module.css';
import styles from '../styles/Resource.module.css';
import CommentStyle from '../styles/Comment.module.css';

import shareIcon from '../public/share.png';
import profile from '../public/profile.png';
import favorite from '../public/favorite.svg';
import notfavorite from '../public/notfavorite.svg';

import { ChangeEvent } from 'react';
import { Resource } from '../interfaces/db/Resource';

interface ResourcePageProps {
	categoryURI: string,
	subcategoryURI: string,
	resourceURI: string,
	data: Resource
};

function ResourcePage(props: ResourcePageProps) {
	const [isFavorite, setIsFavorite] = useState(false);
	const [comment, setComment] = useState('');
	const [comments, setComments] = useState(props.data.comments);
	const [isShare, setIsShare] = useState(false);
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status !== 'authenticated') return;

		if (
			session.user.favorites.includes(
				`${props.categoryURI}/${props.subcategoryURI}/${props.resourceURI}`
			)
		)
			setIsFavorite(true);
	}, [
		session?.user.favorites,
		status,
		props.categoryURI,
		props.subcategoryURI,
		props.resourceURI,
	]);

	function handleFavorite() {
		if (status !== 'authenticated') {
			alert('You must be logged in to favorite something');
			return;
		}
		const FAVORITE_URL = `/api/user/favorite`;

		if (isFavorite) {
			axios
				.post(FAVORITE_URL, {
					uri: `${props.categoryURI}/${props.subcategoryURI}/${props.resourceURI}`,
				})
				.then(() => {
					setIsFavorite(false);
				});
		} else {
			axios
				.post(FAVORITE_URL, {
					uri: `${props.categoryURI}/${props.subcategoryURI}/${props.resourceURI}`,
				})
				.then(() => {
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

		const RESOURCE_COMMENT_URL = `/api/library/comment`;

		axios
			.post(RESOURCE_COMMENT_URL, {
				uri: props.resourceURI,
				content: comment,
			})
			.then(reloadComments);

		setComment('');
	}

	async function reloadComments() {
		const RESOURCE_URL = `/api/library/resource?uri=${props.resourceURI}`;

		const res = await axios.get(RESOURCE_URL);

		setComments(res?.data?.comments);
	}

	function listComments() {
		if (!comments) return null;
		return comments.map((comment) => (
			<Comment key={comment._id} data={comment} />
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
			<section className={HeadStyle.head} id="head">
				<h4>
					<Link
                        href={`/library/${props.categoryURI}`}
                        className={`link ${styles.category}`}>
						{props.categoryURI}
					</Link>
				</h4>
				<h3>
					<Link
                        href={`/library/${props.categoryURI}/${props.subcategoryURI}`}
                        className={`link ${styles.subcategory}`}>
						{props.subcategoryURI}
					</Link>
				</h3>
				<h2>
					<Link href={props.data.link} className={`link ${styles.linkA}`} target="_blank">

                        {props.data.name}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 191.65 66.467"
                            version="1.1"
                        >
                            <defs id="defs4">
                                <clipPath id="clipPath3843">
                                    <path
                                        id="path3845"
                                        style={{ color: '#000000', fill: '#999999' }}
                                        d="m-127.28-391.22v-60.411h-52.004l-46.808 13.214h-5v-8.9286c0-22.333 18.422-40.719 40.75-40.719h63.062v-11.25h-176.28v108.09z"
                                    />
                                </clipPath>
                            </defs>
                            <g id="layer1" transform="translate(-67.72 -414.1)">
                                <rect
                                    id="rect3796"
                                    style={{
                                        color: '#000000',
                                        stroke: '#000000',
                                        strokeWidth: 20,
                                        fill: 'none',
                                    }}
                                    transform="matrix(-1 0 0 -1 -27.857 0)"
                                    clipPath="url(#clipPath3843)"
                                    rx="23.234"
                                    ry="23.234"
                                    height="46.467"
                                    width="109.54"
                                    y="-470.57"
                                    x="-277.23"
                                />
                                <use
                                    id="use3832"
                                    xlinkHref="#rect3796"
                                    transform="matrix(-1 0 0 -1 327.09 894.66)"
                                    height="1052.3622"
                                    width="744.09448"
                                    y="0"
                                    x="0"
                                />
                            </g>
                        </svg>

                    </Link>
				</h2>
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
                            maxWidth: "100%",
                            height: "auto"
                        }} />
				</div>
			</section>
			<section className="section1">
				<h2>Comments</h2>
				<div className={CommentStyle.newCommentBox}>
					<Image
                        src={session?.user?.image || profile}
                        className={CommentStyle.authorImg}
                        width={40}
                        height={40}
                        alt="Profile picture"
                        style={{
                            maxWidth: "100%",
                            height: "auto"
                        }} />
					<textarea name="comment" value={comment} onChange={handleChange} />
					<button onClick={handleComment}>Comment</button>
				</div>
				<div className={CommentStyle.commentDiv}>{listComments()}</div>
			</section>
		</main>
    );
}

export default ResourcePage;
