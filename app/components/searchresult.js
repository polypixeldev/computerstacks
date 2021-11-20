import Link from "next/link";
import SearchStyle from "../styles/Search.module.css";

function SearchResult(props) {
	return (
		<>
			<div className={SearchStyle.result}>
				<Link
					href={`/${
						props.type === "resource" ? "TODO" : `roadmaps/${props.uri}`
					}`}
				>
					<a className="link">{props.name}</a>
				</Link>
				<p>{props.description}</p>
			</div>
			<br />
		</>
	);
}

export default SearchResult;
