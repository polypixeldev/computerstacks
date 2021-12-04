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
	if (typeof window.location.href === 'undefined')
		return (
			<div className={ShareStyle.card}>
				<p>Loading...</p>
			</div>
		);
	return (
		<div className={ShareStyle.card}>
			<p>Share this page!</p>
			<div>
				<FacebookShareButton
					url={window.location.href}
					quote={`Check out ${props.name} on ComputerStacks!`}
					hashtag="#ComputerStacks"
				>
					<FacebookIcon size={25} round />
				</FacebookShareButton>
				<PinterestShareButton
					url={window.location.href}
					media={`Check out ${props.name} on ComputerStacks!`}
					description={`Check out ${props.name} on ComputerStacks!`}
				>
					<PinterestIcon size={25} round />
				</PinterestShareButton>
				<TwitterShareButton
					url={window.location.href}
					title={`Check out ${props.name} on ComputerStacks!`}
				>
					<TwitterIcon size={25} round />
				</TwitterShareButton>
				<WhatsappShareButton
					url={window.location.href}
					title={`Check out ${props.name} on ComputerStacks!`}
				>
					<WhatsappIcon size={25} round />
				</WhatsappShareButton>
				<EmailShareButton
					url={window.location.href}
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
