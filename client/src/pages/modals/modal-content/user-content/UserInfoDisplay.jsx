// Auth
import { logout } from '@/auth/auth';
import { hasMinPermission, userAccessString } from '@/auth/checkRole';

export default function UserInfoDisplay({ onClose, user, setUser, setInfoScreen }) {
	return (<>
		<div className="mb-4">
			{/* User info */}
			<div className="bg-gray-100 rounded-md p-2 outline outline-gray-300">
				<p className="text-xl break-all font-normal">
					{user.username} ({user.role})
				</p>
				<p className="text-md font-light">{userAccessString(user?.role)}</p>
			</div>
			{hasMinPermission(user, 'admin') && <div className="flex w-full mt-1">
				<div className="mx-auto space-x-3">
					{/* User management */}
					<button
						type="button"
						onClick={() => setInfoScreen('userManager')}
						className="text-sm cursor-pointer text-blue-900 hover:text-blue-900/50"
					>Manage Users</button>
					{/* Audit log */}
					<button
						type="button"
						onClick={() => setInfoScreen('auditLog')}
						className="text-sm cursor-pointer text-blue-900 hover:text-blue-900/50"
					>View Audit Log</button>
				</div>
			</div>}
		</div>
		{/* Buttons */}
		<div className="flex-block">
			<button
				type="button"
				onClick={() => {logout(); setUser(null); onClose(true);}}
				className="block mt-2 my-auto text-lg m-auto cursor-pointer p-2 w-full bg-red-400 text-white hover:bg-red-500 rounded"
			>
				Sign Out
			</button>
			<button 
				type="button"
				onClick={() => onClose(false)}
				className="block mt-2 text-lg m-auto cursor-pointer p-2 w-full bg-gray-200 text-gray-400 hover:bg-gray-300 rounded"
			>
				Close
			</button>
		</div>
	</>);
}