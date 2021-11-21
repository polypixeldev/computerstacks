import Link from 'next/link';

import CardStyle from '../styles/Card.module.css';
import HeadStyle from '../styles/Head.module.css';

function Card(props) {
	console.log(props);
	return (
		<Link
			href={`/library/${props.category ? `${props.category}/` : ''}${
				props.subcategory ? `${props.subcategory}/` : ''
			}${props.uri}`}
		>
			<a className="link">
				<div className={CardStyle.card}>
					<div>
						<p className={CardStyle.name}>{props.name}</p>
						<p className={CardStyle.desc}>{props.description}</p>
					</div>
					<div className={HeadStyle.actionDiv}>
						<p>1</p>
						<p>2</p>
						<p>3</p>
					</div>
				</div>
			</a>
		</Link>
	);
}

export default Card;
