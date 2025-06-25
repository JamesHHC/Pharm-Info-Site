// React
import { useEffect, useState } from 'react';

// Auth
import { hasMinPermission, roleList } from '../../../auth/checkRole';

// Assets
import LoadingIcon from '../../../assets/icons/LoadingIcon';

// Config
import config from '../../../config.js';
const serverIp = config.server_ip;
const serverPort = config.server_port;

export default function UserManagement({ onClose, user, setUser, setUserManager }) {
	const [accounts, setAccounts] = useState([]);
	const [searchedUser, setSearchedUser] = useState('');
	const [loadingChange, setLoadingChange] = useState(false);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await fetch(`http://${serverIp}:${serverPort}/api/users`);
				const data = await res.json();
				setAccounts(data);
			}
			catch (err) {
				console.error('Failed to fetch users', err);
			}
		}
		fetchUsers();
	}, []);

	const filteredAccounts = accounts
		.slice()
		.sort((a, b) => a.username.localeCompare(b.username))
		.filter((account) =>
			account.username.toLowerCase().includes(searchedUser.toLowerCase())
		);

	// Update given user ID with selected role
	const updateRole = async (id, newRole, loadingId) => {
		const spinner = document.getElementById(loadingId);
		spinner.hidden = false;
		setLoadingChange(true);

		const token = localStorage.getItem('token');
		const res = await fetch(`http://${serverIp}:${serverPort}/api/users/role`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify({ id: id, role: newRole }),
		});
		const response = await res.json();

		if (response.error) {
			alert('Failed to update user role!');
			console.error(response.error);
		}
		spinner.hidden = true;
		setLoadingChange(false);
	};

	return (<>
		<div className="mb-4">
			<input
				className="flex outline outline-gray-300 rounded-md w-full mb-2 py-1 px-2"
				type="text"
				tabIndex='-1'
				id="user-search-bar"
				value={searchedUser}
				onChange={(e) => setSearchedUser(e.target.value)}
				placeholder="Search for a user..."
			/>
			<div className="bg-gray-100 rounded-md px-2 py-1 outline outline-gray-300 overflow-y-auto scrollbar-thin">
				{filteredAccounts.map(account => {
					const noChange = !hasMinPermission(user, account.role) || account.username === user.username;
					return (
						<div key={account.id} className="my-2">
							<div className="flex bg-white p-2 rounded shadow-sm outline outline-gray-300">
								<div className="my-auto mr-3">
									{account.username}
								</div>
								<div className="flex ml-auto">
									<div hidden id={`loading_${account.id}`} className="my-auto">
										<LoadingIcon fill="fill-blue-900/50" text="text-gray-200"/>
									</div>
									<select
										name="roles"
										defaultValue={account.role}
										id={`roles_${account.id}`}
										disabled={noChange || loadingChange}
										className={`${noChange ? 'bg-gray-200 text-gray-400 outline-gray-300' : 'outline-gray-200'} cursor-pointer ml-auto py-1 px-2 rounded-md outline`}
										onChange={(e) => updateRole(account.id, e.target.value, `loading_${account.id}`)}
									>
										{roleList.map(listedRole => {
											const aboveUser = !hasMinPermission(user, listedRole);
											return (
												<option
													key={listedRole}
													value={listedRole}
													disabled={aboveUser}
													className={aboveUser ? 'text-gray-300' : ''}
												>
													{listedRole}
												</option>
											);
										})}
									</select>
								</div>
							</div>
						</div>
					);
				})}
			</div>
			<button
				type="button"
				onClick={() => setUserManager(false)}
				className="block text-sm m-auto cursor-pointer mt-1 text-blue-900 hover:text-blue-900/50"
			>
				Back
			</button>
		</div>
		{/* Buttons */}
		<div className="flex-block">
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