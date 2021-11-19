import HeadStyles from "../../styles/Head.module.css";
import CommentStyle from "../../styles/Comment.module.css";
import Comment from "../../components/comment";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Loading from "../../components/loading";

import roadmap from "../../public/favorite.svg";
import notroadmap from "../../public/notfavorite.svg";
import profile from "../../public/profile.png";

function Roadmap(props) {
	const router = useRouter();
	const { data: session, status } = useSession();

	const [isRoadmap, setIsRoadmap] = useState(false);
	const [comment, setComment] = useState("");
	const [comments, setComments] = useState(props?.data?.comments);

	useEffect(() => {
		if (status !== "authenticated") return;

		if (session.user.roadmaps.includes(router.query.roadmap))
			setIsRoadmap(true);
	}, [session?.user.roadmaps, status, router.query.roadmap]);

	useEffect(() => {
		setComments(props?.data?.comments);
	}, [props?.data?.comments]);

	if (router.isFallback) return <Loading />;

	function handleRoadmap() {
		const ROADMAP_URL = `/api/user/roadmap`;

		if (isRoadmap) {
			setIsRoadmap(false);
			axios.post(ROADMAP_URL, {
				uri: router.query.roadmap,
			});
		} else {
			setIsRoadmap(true);
			axios.post(ROADMAP_URL, {
				uri: router.query.roadmap,
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
		const ROADMAPS_COMMENT_URL = `/api/roadmaps/comment`;

		axios
			.post(ROADMAPS_COMMENT_URL, {
				uri: router.query.roadmap,
				content: comment,
			})
			.then(reloadComments);

		setComment("");
	}

	async function reloadComments() {
		console.log("reloading...");
		const ROADMAP_URL = `/api/roadmaps/roadmap?uri=${router.query.roadmap}`;

		let res = await axios.get(ROADMAP_URL);

		setComments(res.data.comments);
	}

	function listComments() {
		console.log(comments);
		if (!comments) return null;
		return comments.map((comment) => (
			<Comment key={comment._id} data={comment} />
		));
	}

	return (
		<main>
			<section className={HeadStyles.head}>
				<h2>{props.data.name}</h2>
				<p>{props.data.description}</p>
				<div className={HeadStyles.actionDiv}>
					<p>1</p>
					<Image
						onClick={handleRoadmap}
						src={isRoadmap ? roadmap : notroadmap}
						alt="Favorite button"
						width={75}
						height={75}
					/>
					<p>3</p>
				</div>
			</section>
			<section className="section1">
				<h2>Roadmap</h2>
				<Image
					src={props.data.image}
					alt="The roadmap"
					width={800}
					height={600}
				/>
			</section>
			<section className="section2">
				<h2>Comments</h2>
				<div className={CommentStyle.newCommentBox}>
					<Image
						src={session?.user?.image || profile}
						className={CommentStyle.authorImg}
						width={40}
						height={40}
						alt="Profile picture"
					/>
					<textarea name="comment" value={comment} onChange={handleChange} />
					<button onClick={handleComment}>Comment</button>
				</div>
				<div className={CommentStyle.commentDiv}>{listComments()}</div>
			</section>
		</main>
	);
}

export async function getStaticPaths() {
	const ROADMAPS_META_URL = `/api/roadmaps/meta`;

	let res = { paths: [], fallback: true };

	const data = await axios.get(ROADMAPS_META_URL)?.data;

	if (!data) return res;

	for (let roadmap of data.roadmaps)
		res.paths.push({ params: { roadmap: roadmap.uri } });

	return res;
}

export async function getStaticProps({ params }) {
	const ROADMAP_DATA_URL = `/api/roadmaps/roadmap?uri=${params.roadmap}`;

	let res = { revalidate: 60, props: { data: {}, error: false } };

	let data = await axios.get(ROADMAP_DATA_URL);
	data = data.data;
	if (!data) res.props.error = true;
	else res.props.data = data;

	return res;
}

export default Roadmap;
