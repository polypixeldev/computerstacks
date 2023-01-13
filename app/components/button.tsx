import type { MouseEvent } from 'react';

function Button({
	children,
	onClick,
}: {
	children: React.ReactNode;
	onClick?: (event: MouseEvent) => void;
}) {
	return (
		<button
			onClick={onClick}
			className="m-2 flex flex-grow flex-col items-center justify-center rounded-3xl border-4 border-input-light bg-button p-1 px-8 font-zilla-slab text-2xl text-white"
		>
			{children}
		</button>
	);
}

export default Button;
