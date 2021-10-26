import Link from "next/link";
import SearchStyle from "../styles/Search.module.css";

function SearchResult(props) {
	return (
		<>
			<div className={SearchStyle.result}>
				<Link href={props.url}>
					<a className="link">{props.name}</a>
				</Link>
				<p>{props.description}</p>
			</div>
			<hr />
		</>
	);
}

export default SearchResult;
