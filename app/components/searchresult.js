import Link from 'next/link';

import SearchStyle from '../styles/Search.module.css';

function SearchResult(props) {
	return (
		<>
			<div className={SearchStyle.result}>
				<Link
					href={`/${
						props.type === 'resource'
							? `library/${props.parent.parent.uri}/${props.parent.uri}/${props.uri}`
							: props.type === 'category'
							? `library${`/${props.parent?.uri}` || ''}/${props.uri}`
							: `roadmaps/${props.uri}`
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
