// React
import { useEffect, useState, useRef } from 'react';

// Auth
import { hasMinPermission, aboveRole, roleList } from '@/auth/checkRole';

// Assets
import FilterIcon from '@/assets/icons/FilterIcon';

// Config
import config from '@/config.js';
const serverIp = config.server_ip;
const serverPort = config.server_port;

export default function UserInfoDisplay({ onClose, user, setUser, setInfoScreen }) {
	// Logs
	const [logs, setLogs] = useState([]);
	const [lastUpdated, setLastUpdated] = useState('');

	// Search tools
	const [search, setSearch] = useState('');
	const [sortDesc, setSortDesc] = useState(true);
	const [sortBy, setSortBy] = useState('time');
	const [refreshCooldown, setRefreshCooldown] = useState(false);

	// Pagination
	const [page, setPage] = useState(0);
	const pageSize = 100;

	// Stablized modal width
	const [minWidth, setMinWidth] = useState(0);
	const tableRef = useRef();

	const fetchLogs = async () => {
		try {
			const token = localStorage.getItem('token');
			const res = await fetch(`http://${serverIp}:${serverPort}/api/logs`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
			});
			// Update data
			const data = await res.json();
			setLogs(data);
			// Set timestamp
			const timeStamp = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
			setLastUpdated(timeStamp);
		}
		catch (err) {
			console.error('Failed to fetch logs', err);
		}
	}

	// Get logs on load
	useEffect(() => {
		fetchLogs();
	}, []);

	// Set minimum width on log load/page change
	useEffect(() => {
		if (tableRef.current)
			setMinWidth(tableRef.current.offsetWidth);
	}, [logs.length, page]);

	const filteredLogs = logs
		.slice()
		.sort((a, b) => { 
			const direction = sortDesc ? -1 : 1;
			switch(sortBy) {
				case 'user':
					return a.acting_user.localeCompare(b.acting_user) * direction;
				case 'action':
					return a.action.localeCompare(b.action) * direction;
				case 'target':
					const tA = a.target || '';
					const tB = b.target || '';
					return tA.localeCompare(tB) * direction;
				case 'time':
					return a.id > b.id ? direction : a.id < b.id ? direction * -1 : 0;
			}
		})
		.filter((log) => {
			const terms = search
				.split(';')
				.map(term => term.trim().toLowerCase());
			return terms.every(term =>
				(log.acting_user?.toLowerCase() || '').includes(term) ||
				(log.action?.toLowerCase() || '').includes(term) ||
				(log.target?.toLowerCase() || '').includes(term)
			);
		});
	const paginatedLogs = filteredLogs.slice(page * pageSize, (page + 1) * pageSize);

	const refreshLogs = () => {
		if (refreshCooldown) return;

		setRefreshCooldown(true);
		fetchLogs();
		// 3 second cooldown
		setTimeout(() => { setRefreshCooldown(false); }, 3000);
	};

	return(<>
		<div className="mb-4">
			<div className="mb-2">
				<span className="flex text-xs">Last Updated: {lastUpdated}</span>
				<span className="flex font-bold text-xl text-[#636373]">Search Activity Log</span>
			</div>
			{/* Toolbar */}
			<div className="flex mb-2 w-full">
				{/* Search bar */}
				<div className="flex outline outline-gray-300 rounded-md w-full">
					<input
						className="rounded-l-md py-1 px-2 h-8.5 outline-0 w-full"
						type="text"
						tabIndex='-1'
						id="user-search-bar"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Use a semicolon to separate queries... (e.g. John;Deleted rule)"
					/>
					{/* Filter Button */}
					{/* TODO: Depending on need */}
					{/*<button
						tabIndex='-1'
						onClick={() => {null}}
						className="cursor-pointer rounded-r-md p-2 h-8.5 w-8.5 flex items-center justify-center bg-gray-200 hover:bg-gray-300"
					>
						<FilterIcon w="16" h="16" />
					</button>*/}
				</div>
				{/* Refresh Button */}
				<button
					tabIndex='-1'
					disabled={refreshCooldown}
					onClick={() => refreshLogs()}
					className="group ml-2 outline outline-gray-300 enabled:cursor-pointer rounded-md p-2 h-8.5 w-8.5 flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
				>
					<span className={refreshCooldown ? '' : 'group-hover:animate-spin'}>⟳</span>
				</button>
			</div>
			<div className="h-[40vh] bg-white rounded-md outline outline-gray-300 overflow-y-auto scrollbar-lborder scrollbar-thin resize-y" ref={tableRef} style={{minWidth}}>
				<table className="text-sm text-left w-full">
					<thead className="sticky top-0 z-10 bg-gray-300">
						<tr>
							{/* User Header */}
							<th
								className="px-4 py-2 hover:bg-gray-400/20 cursor-pointer"
								onClick={() => {
									if (sortBy != 'user') {
										setSortBy('user');
										setSortDesc(true);
									}
									else setSortDesc(!sortDesc);
								}}
							>User {sortBy == 'user' && <span>{sortDesc ? '↓' : '↑'}</span>}</th>
							{/* Action Header */}
							<th
								className="px-4 py-2 hover:bg-gray-400/30 cursor-pointer bg-gray-400/10"
								onClick={() => {
									if (sortBy != 'action') {
										setSortBy('action');
										setSortDesc(true);
									}
									else setSortDesc(!sortDesc);
								}}
							>Action {sortBy == 'action' && <span>{sortDesc ? '↓' : '↑'}</span>}</th>
							{/* Target Header */}
							<th
								className="px-4 py-2 hover:bg-gray-400/20 cursor-pointer"
								onClick={() => {
									if (sortBy != 'target') {
										setSortBy('target');
										setSortDesc(true);
									}
									else setSortDesc(!sortDesc);
								}}
							>Target {sortBy == 'target' && <span>{sortDesc ? '↓' : '↑'}</span>}</th>
							{/* Time Header */}
							<th
								className="px-4 py-2 hover:bg-gray-400/30 cursor-pointer bg-gray-400/10"
								onClick={() => {
									if (sortBy != 'time') {
										setSortBy('time');
										setSortDesc(true);
									}
									else setSortDesc(!sortDesc);
								}}
							>Time {sortBy == 'time' && <span>{sortDesc ? '↓' : '↑'}</span>}</th>
						</tr>
					</thead>
					<tbody>
						{paginatedLogs.map((log) => {
							const target = log.target || '';
							const longTarget = target.length > 40;
							return (<tr key={log.id} className="bg-white">
									<td className="px-4 py-2 border-b border-gray-200">{log.acting_user}</td>
									<td className="px-4 py-2 border-b border-gray-200 bg-gray-100">{log.action}</td>
									<td title={longTarget ? target : ''} className="px-4 py-2 border-b border-gray-200">{longTarget ? target.slice(0, 40 - 3) + '...' : target}</td>
									<td className="px-4 py-2 border-b border-gray-200 bg-gray-100">{formatTimestamp(log.timestamp)}</td>
							</tr>);
						})}
					</tbody>
				</table>
			</div>
			{/* Pagination */}
			<div className="flex justify-center mt-1 gap-x-2">
				{/* Prev Page */}
				<button
					disabled={page === 0}
					onClick={() => setPage(p => p - 1)}
					className="enabled:cursor-pointer text-blue-900 disabled:text-blue-900/30 enabled:hover:text-blue-900/50"
				>Prev</button>
				{/* Page Indicator */}
				<span className="font-bold text-[#636373]">{
					filteredLogs.length > 0
					? `Page ${page + 1} of ${Math.ceil(filteredLogs.length / pageSize)}`
					: 'No results'
				}</span>
				{/* Next Page */}
				<button
					disabled={(page + 1) * pageSize >= filteredLogs.length}
					onClick={() => setPage(p => p + 1)}
					className="enabled:cursor-pointer text-blue-900 disabled:text-blue-900/30 enabled:hover:text-blue-900/50"
				>Next</button>
			</div>
			{/* Back Button */}
			<button
				type="button"
				onClick={() => setInfoScreen('')}
				className="block text-sm m-auto mt-1 cursor-pointer text-blue-900 hover:text-blue-900/50"
			>
				Back
			</button>
		</div>
		{/* Close Button */}
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

	// Convert an ISO timestamp into the format "MM/DD/YY, hh:mm AM/PM"
	function formatTimestamp(iso) {
		return new Intl.DateTimeFormat('en-US', {
			year: '2-digit',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
			timeZone: 'America/New_York',
		}).format(new Date(iso));
	}
}