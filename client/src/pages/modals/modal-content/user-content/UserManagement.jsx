// React
import { useEffect, useState, useRef } from 'react';

// Auth
import { hasMinPermission, aboveRole, roleList } from '@/auth/checkRole';

// Assets
import LoadingIcon from '@/assets/icons/LoadingIcon';
import TrashIcon from '@/assets/icons/TrashIcon';

// Config
import config from '@/config.js';
const serverIp = config.server_ip;
const serverPort = config.server_port;

export default function UserManagement({ onClose, user, setUser, setInfoScreen }) {
	const [accounts, setAccounts] = useState([]);
	const [searchedUser, setSearchedUser] = useState('');
	const [loadingChange, setLoadingChange] = useState(false);
	const [minWidth, setMinWidth] = useState(0);
	const usersRef = useRef();

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

	useEffect(() => {
		fetchUsers();
	}, []);

	useEffect(() => {
		if (usersRef.current)
			setMinWidth(usersRef.current.offsetWidth);
	}, [accounts.length]);

	const filteredAccounts = accounts
		.slice()
		.sort((a, b) => a.username.localeCompare(b.username))
		.filter((account) =>
			account.username.toLowerCase().includes(searchedUser.toLowerCase())
		);

	// Update given user ID with selected role
	const updateRole = async (id, newRole, loadingId) => {
		const spinner = document.getElementById(loadingId);
		spinner.setAttribute('data-invisible', 'false');
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
		spinner.setAttribute('data-invisible', 'true');
		setLoadingChange(false);
	};

	return (<>
		<div className="mb-4">
			<span className="flex mb-2 font-bold text-xl text-[#636373]">Manage Users</span>
			<input
				className="flex h-8.5 outline outline-gray-300 rounded-md w-full mb-2 py-1 px-2"
				type="text"
				tabIndex='-1'
				id="user-search-bar"
				value={searchedUser}
				onChange={(e) => setSearchedUser(e.target.value)}
				placeholder="Search for a user..."
			/>
			<div ref={usersRef} style={{minWidth}} className="h-[40vh] bg-gray-100 rounded-md px-2 py-1 outline outline-gray-300 overflow-y-auto scrollbar-thin resize-y">
				{filteredAccounts.map(account => {
					const noChange = !aboveRole(user, account.role) || account.username === user.username;
					return (
						<div key={account.id} className="my-2">
							<div className="flex flex-wrap bg-white p-2 rounded shadow-sm outline outline-gray-300">
								<div className="my-auto break-words mr-auto">
									{account.username}
								</div>
								<div data-invisible="true" id={`loading_${account.id}`} className="my-auto ml-1">
									<LoadingIcon fill="fill-blue-900/50" text="text-gray-200"/>
								</div>
								<div className="flex">
									{/* Role selection */}
									<select
										name="roles"
										defaultValue={account.role}
										id={`roles_${account.id}`}
										disabled={noChange || loadingChange}
										className={`${noChange ? 'bg-gray-200 text-gray-400 outline-gray-300' : 'outline-gray-200 cursor-pointer'} py-1 px-2 rounded-md outline`}
										onChange={(e) => updateRole(account.id, e.target.value, `loading_${account.id}`)}
									>
										{roleList.map(listedRole => {
											const aboveUser = !aboveRole(user, listedRole);
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
									{/* Delete button ('admin creator' and above) */}
									<button
										disabled={noChange}
										hidden={!hasMinPermission(user, 'admin creator')}
										type="button"
										className={`${noChange ? 'opacity-50' : 'hover:bg-red-800/30 cursor-pointer'} flex text-red-700 bg-red-800/20 my-auto ml-2 p-1 rounded-full`}
										onClick={async () => {
											const conf = confirm(`Delete ${account.username}?\n\nWARNING: This action cannot be undone`)
											if (conf) {
												const token = localStorage.getItem('token');
												await fetch(`http://${serverIp}:${serverPort}/api/users?id=${account.id}`, {
													method: 'DELETE',
													headers: {
														'Content-Type': 'application/json',
														'Authorization': `Bearer ${token}`,
													},
												});
												fetchUsers();
											}
										}}
									>
										<TrashIcon/>
									</button>
								</div>
							</div>
						</div>
					);
				})}
			</div>
			<button
				type="button"
				onClick={() => setInfoScreen('')}
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