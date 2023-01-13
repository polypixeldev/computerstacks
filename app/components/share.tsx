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

import Button from './button';

interface ShareProps {
	href?: string;
	name: string;
	toggle: () => void;
}

function Share(props: ShareProps) {
	let href = props.href;
	if (!href) {
		if (typeof window === 'undefined') {
			href = '';
			return null;
		} else {
			href = window.location.href;
		}
	}

	return (
		<div className="absolute right-3 z-10 flex w-96 flex-col items-center justify-center rounded-sm bg-share shadow-sm shadow-gray-3">
			<p>Share this page!</p>
			<div className="flex w-full flex-row items-center justify-around">
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
			<Button onClick={props.toggle}>Close</Button>
		</div>
	);
}

export default Share;
