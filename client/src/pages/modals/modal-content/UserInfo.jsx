import React from 'react';
import { logout } from '../../../auth/auth';
import { userAccessString } from '../../../auth/checkRole';

// Assets
import logo from '../../../assets/logo_bluegray.svg';

export default function UserInfo({ onClose, user, setUser }) {
	return (
		<div className="min-w-70 max-w-150 text-[RGB(99,99,115)]">
			{/* Header */}
			<img src={logo} alt="HHC Logo" className="h-24 m-auto mb-6"/>
			{/* User info */}
			<div className="mb-2 bg-gray-100 rounded-md p-2 outline outline-gray-300">
				<p className="text-xl break-all font-normal">
					User: {user.username}
				</p>
				<p className="text-xl font-normal">
					Role: {user.role}
				</p>
			</div>
			{/* Access level */}
			<div className="flex">
				<p className="mb-4 m-auto font-light">{userAccessString(user?.role)}</p>
			</div>
			{/* Buttons */}
			<div className="flex-block">
				<button
					type="button"
					onClick={() => {logout(); setUser(null);}}
					className="block mt-2 my-auto text-lg m-auto cursor-pointer p-2 w-full bg-red-400 text-white hover:bg-red-500 rounded"
				>
					Sign Out
				</button>
				<button 
					type="button"
					onClick={() => onClose()}
					className="block mt-2 text-lg m-auto cursor-pointer p-2 w-full bg-gray-200 text-gray-400 hover:bg-gray-300 rounded"
				>
					Close
				</button>
			</div>
		</div>
	);
}