import HeadStyle from "../styles/Head.module.css";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import styles from "../styles/Resource.module.css";
import favorite from "../public/favorite.svg";
import notfavorite from "../public/notfavorite.svg";
import profile from "../public/profile.png";

function ResourcePage(props) {
	const [isFavorite, setIsFavorite] = useState(false);
	const [comment, setComment] = useState("");
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status !== "authenticated") return;

		if (
			session.user.favorites.includes(
				`${props.category}/${props.subcategory}/${props.resource}`
			)
		)
			setIsFavorite(true);
	}, [
		session?.user.favorites,
		status,
		props.category,
		props.subcategory,
		props.resource,
	]);

	function handleFavorite() {
		const FAVORITE_URL = `/api/user/favorite`;

		if (isFavorite) {
			setIsFavorite(false);
			axios.post(FAVORITE_URL, {
				uri: `${props.category}/${props.subcategory}/${props.resource}`,
			});
		} else {
			setIsFavorite(true);
			axios.post(FAVORITE_URL, {
				uri: `${props.category}/${props.subcategory}/${props.resource}`,
			});
		}
	}

	function handleChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		if (name === "comment") setComment(value);
	}

	function handleComment() {
		const RESOURCE_COMMENT_URL = `/api/library/comment`;

		axios.post(RESOURCE_COMMENT_URL, {
			uri: props.resource,
			content: comment,
		});
		setComment("");
	}

	return (
		<main>
			<section className={HeadStyle.head} id="head">
				<h4>
					<Link href={`/library/${props.category}`}>
						<a className={`link ${styles.category}`}>{props.category}</a>
					</Link>
				</h4>
				<h3>
					<Link href={`/library/${props.category}/${props.subcategory}`}>
						<a className={`link ${styles.subcategory}`}>{props.subcategory}</a>
					</Link>
				</h3>
				<h2>
					<Link href={props.data.link}>
						<a className="link">{props.data.name}</a>
					</Link>
				</h2>
				<p>{props.data.description}</p>
				<div className={HeadStyle.actionDiv}>
					<p>1</p>
					<Image
						onClick={handleFavorite}
						src={isFavorite ? favorite : notfavorite}
						alt="Favorite button"
						width={75}
						height={75}
					/>
					<p>3</p>
				</div>
			</section>
			<section className="section1">
				<h2>Comments</h2>
				<div className={styles.newCommentBox}>
					<Image
						src={session?.user?.image || profile}
						width={40}
						height={40}
						alt="Profile picture"
					/>
					<textarea name="comment" value={comment} onChange={handleChange} />
					<button onClick={handleComment}>Comment</button>
				</div>
				<div>
					<p>1</p>
					<p>2</p>
					<p>3</p>
				</div>
			</section>
		</main>
	);
}

export default ResourcePage;
