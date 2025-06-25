// Auth
import { logout } from '../../../auth/auth';
import { hasMinPermission, userAccessString } from '../../../auth/checkRole';

export default function UserInfoDisplay({ onClose, user, setUser, setUserManager }) {
	return (<>
		<div className="mb-4">
			{/* User info */}
			<div className="bg-gray-100 rounded-md p-2 outline outline-gray-300">
				<p className="text-xl break-all font-normal">
					{user.username} ({user.role})
				</p>
				<p className="text-md font-light">{userAccessString(user?.role)}</p>
			</div>
			{/* User management */}
			{hasMinPermission(user, 'admin') &&
				<button
					type="button"
					onClick={() => setUserManager(true)}
					className="block text-sm m-auto cursor-pointer mt-1 text-blue-900 hover:text-blue-900/50"
				>
					Manage User Roles
				</button>
			}
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
	</>);
}