import {
	FacebookShareButton,
	FacebookIcon,
	PinterestShareButton,
	PinterestIcon,
	TwitterShareButton,
	TwitterIcon,
	WhatsappShareButton,
	WhatsappIcon,
	EmailShareButton,
	EmailIcon,
} from 'next-share';
import { useRouter } from 'next/router';

import ShareStyle from '../styles/Share.module.css';

function Share(props) {
	let href = props.href;
	if (!href) {
		if (typeof window === 'undefined') {
			href = '';
			return (
				<div className={ShareStyle.card}>
					<p>Loading...</p>
				</div>
			);
		} else {
			href = window.location.href;
		}
	}

	return (
		<div className={ShareStyle.card}>
			<p>Share this page!</p>
			<div>
				<FacebookShareButton
					url={href}
					quote={`Check out ${props.name} on ComputerStacks!`}
					hashtag="#ComputerStacks"
				>
					<FacebookIcon size={25} round />
				</FacebookShareButton>
				<PinterestShareButton
					url={href}
					media={`Check out ${props.name} on ComputerStacks!`}
					description={`Check out ${props.name} on ComputerStacks!`}
				>
					<PinterestIcon size={25} round />
				</PinterestShareButton>
				<TwitterShareButton
					url={href}
					title={`Check out ${props.name} on ComputerStacks!`}
				>
					<TwitterIcon size={25} round />
				</TwitterShareButton>
				<WhatsappShareButton
					url={href}
					title={`Check out ${props.name} on ComputerStacks!`}
				>
					<WhatsappIcon size={25} round />
				</WhatsappShareButton>
				<EmailShareButton
					url={href}
					subject={`Check out ${props.name} on ComputerStacks!`}
					body={`Check out ${props.name} on ComputerStacks!`}
				>
					<EmailIcon size={25} round />
				</EmailShareButton>
			</div>
			<button className="button-small" onClick={props.toggle}>
				Close
			</button>
		</div>
	);
}

export default Share;
