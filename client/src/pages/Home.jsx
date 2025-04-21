import { useState } from 'react';

function Home() {
	const [activeTab, setActiveTab] = useState('pharmacies');
	const [searchTerm, setSearchTerm] = useState('');
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
					{/* Search bar & create button */}
					<div className="flex space-x-2 h-10.5 mb-2">
						<input
							type="text"
							placeholder={`Search ${activeTab}...`}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="h-full w-full px-4 border border-gray-300 rounded-md focus:outline-blue-300"
						/>
						<button
							onClick={handleAdd}
							className="w-12 h-10.5 text-4xl font-medium bg-green-400 text-white rounded-md hover:bg-green-300"
						>
							<span className="relative bottom-[3px]">+</span>
						</button>
					</div>
					{/* Tab Content */}
					<div className="flex-1 overflow-auto">
						{activeTab === 'pharmacies' &&
						<div>
							Pharmacy list goes here
						</div>
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