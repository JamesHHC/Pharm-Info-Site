import { useLocation } from 'react-router-dom';

function NotFound() {
	const slug = useLocation().pathname;
	return (<>
		{/* 404 page */}
		<div className="flex h-screen">
			<div className="m-auto text-center">
				{/* User's path */}
				<div className="py-1 px-2 rounded-md bg-gray-100 w-min m-auto">
					<p className="font-light text-gray-400">{slug}</p>
				</div>
				{/* Animated icon */}
				<p className="text-7xl mt-3 mb-6 text-center inline-block animate-[search_9s_ease-in-out_infinite]">
					🔎
				</p>
				{/* Error message */}
				<p className="light-large">404 - Page not found</p>
				<p className="font-light text-sm">
					Please return to{' '}
					{/* URL to homepage */}
					<a href="/" className="text-blue-500 hover:text-blue-300">
						home
					</a>
				</p>
			</div>
		</div>

		{/* Styling for search animation */}
		<style>
			{`
				@keyframes search {
					0%   { transform: translate(0px, 0px); }
					10%  { transform: translate(6px, -4px); }
					20%  { transform: translate(-10px, 5px); }
					30%  { transform: translate(8px, 12px); }
					40%  { transform: translate(-6px, -8px); }
					50%  { transform: translate(14px, 6px); }
					60%  { transform: translate(-12px, 4px); }
					70%  { transform: translate(4px, -10px); }
					80%  { transform: translate(-8px, 7px); }
					90%  { transform: translate(5px, 4px); }
					100% { transform: translate(0px, 0px); }
				}
			`}
		</style>
	</>);
}

export default NotFound;