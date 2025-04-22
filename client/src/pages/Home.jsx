import { useState, useEffect } from 'react';

function Home() {
	const [activeTab, setActiveTab] = useState('pharmacies');
	const [searchTerm, setSearchTerm] = useState('');
	const [pharmacies, setPharmacies] = useState([]);

	useEffect(() => {
		const fetchPharmacies = async () => {
			try {
				const res = await fetch('http://localhost:5000/api/pharmacies');
				const data = await res.json();
				setPharmacies(data);
			} catch (err) {
				console.error('Failed to fetch pharmacies', err);
			}
		};

		fetchPharmacies();
	}, []);

	const filteredPharmacies = pharmacies.filter((pharmacy) =>
		pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="flex h-screen p-1 bg-gray-200 min-w-[1100px]">
			<div className="w-1/4 p-1">
				{/* Left Column with Tabs */}
				<div className="p-4 rounded-xl shadow-lg h-full bg-white flex flex-col">
					{/* Tab Buttons */}
					<div className="flex space-x-2 mb-4">
						<button
							onClick={() => setActiveTab('pharmacies')}
							className={`px-4 py-2 rounded-md w-1/2 ${
								activeTab === 'pharmacies'
									? 'bg-gray-400 text-white font-bold'
									: 'bg-gray-100 text-gray-400'
							}`}
						>
							Pharmacies
						</button>
						<button
							onClick={() => setActiveTab('contacts')}
							className={`px-4 py-2 rounded-md w-1/2 ${
								activeTab === 'contacts'
									? 'bg-gray-400 text-white font-bold'
									: 'bg-gray-100 text-gray-400'
							}`}
						>
							Contacts
						</button>
					</div>
					<div className="flex space-x-2 h-10.5 mb-4">
						{/* Search Bar */}
						<input
							type="text"
							placeholder={`Search ${activeTab}...`}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="h-full w-full px-4 border border-gray-300 rounded-md focus:outline-blue-300"
						/>
						{/* Create Button */}
						<button
							onClick={handleAdd}
							className="w-12 h-10.5 text-4xl font-medium bg-green-500 text-white rounded-md hover:bg-green-400"
						>
							<span className="relative bottom-[3px]">+</span>
						</button>
					</div>
					{/* Tab Content */}
					<div className="flex-1 overflow-auto">
						{activeTab === 'pharmacies' &&
						<ul className="space-y-2">
							{filteredPharmacies.map((pharmacy) => (
								<li
									key={pharmacy.id}
									className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
								>
									<strong>{pharmacy.name}</strong><br></br>
									{pharmacy.verbal_orders ? 'Verbal orders allowed' : 'No verbal orders'}
								</li>
							))}
						</ul>
					}
						{activeTab === 'contacts' &&
						<div>
							Contact list goes here
						</div>
					}
					</div>
				</div>
			</div>
			<div className="w-3/4 p-1">
				{/* Right Column */}
				<div className="p-4 rounded-xl shadow-lg h-full bg-white">
					Right content
				</div>
			</div>
		</div>
	)
}

function handleAdd(){
	console.log("Add");
}

export default Home