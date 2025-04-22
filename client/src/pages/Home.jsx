import { useState, useEffect } from 'react';

import PharmacyFormModal from './modals/PharmacyFormModal';
import ContactFormModal from './modals/ContactFormModal';

function Home() {
	// For tabs/search bar
	const [activeTab, setActiveTab] = useState('pharmacies');
	const [searchTerm, setSearchTerm] = useState('');
	// For pharmacy/contact lists
	const [pharmacies, setPharmacies] = useState([]);
	const [contacts, setContacts] = useState([]);
	// For modals
	const [showPharmacyModal, setShowPharmacyModal] = useState(false);
	const [showContactModal, setShowContactModal] = useState(false);

	// Sync lists to db
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
		const fetchContacts = async () => {
			try {
				const res = await fetch('http://localhost:5000/api/contacts');
				const data = await res.json();
				setContacts(data);
			} catch (err) {
				console.error('Failed to fetch pharmacies', err);
			}
		};
		fetchPharmacies();
		fetchContacts();

		// Set up auto-refresh
		const interval = setInterval(() => {
			fetchPharmacies();
			fetchContacts();
		}, 10000);

		return () => clearInterval(interval);
	}, []);

	// Filter lists
	const filteredPharmacies = pharmacies.filter((pharmacy) =>
		pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase())
	);
	const filteredContacts = contacts.filter((contact) =>
		contact.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<>
		<div className="flex h-screen p-1 bg-gray-200 min-w-[1100px]">
			<div className="w-1/4 p-1">
				{/* Left Column with Tabs */}
				<div className="p-4 rounded-xl shadow-lg h-full bg-white flex flex-col">
					{/* Tab Buttons */}
					<div className="flex space-x-2 mb-4">
						<button
							tabIndex='-1'
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
							tabIndex='-1'
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
							tabIndex='-1'
							type="text"
							placeholder={`Search ${activeTab}...`}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="h-full w-full px-4 border border-gray-300 rounded-md focus:outline-blue-300"
						/>
						{/* Create Button */}
						<button
							tabIndex='-1'
							onClick={handleAdd}
							className="w-12 h-10.5 text-4xl font-medium bg-green-500 text-white rounded-md hover:bg-green-400"
						>
							<span className="relative bottom-[3px]">+</span>
						</button>
					</div>
					{/* Tab Content */}
					<div className="flex-1 overflow-auto scrollbar-thin pr-1">
						{/* Pharmacy list */}
						{ activeTab === 'pharmacies' &&
							<ul className="space-y-2">
								{filteredPharmacies.map((pharmacy) => (
									<li
										key={pharmacy.id}
										className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer shadow-sm"
									>
										<h2>{pharmacy.name}</h2>
										<h5>{pharmacy.verbal_orders ? 'Verbal orders allowed' : 'No verbal orders'}</h5>
										<p>{pharmacy.general_notes}</p>
									</li>
								))}
							</ul>
						}
						{/* Contact list */}
						{ activeTab === 'contacts' &&
							<ul className="space-y-2">
								{filteredContacts.map((contact) => (
									<li
										key={contact.id}
										className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer shadow-sm"
									>
										<h2>{contact.name}</h2>
										<h5>{contact.title}</h5>
										<p>{contact.preferences}</p>
									</li>
								))}
							</ul>
						}
					</div>
				</div>
			</div>
			<div className="w-3/4 p-1">
				{/* Details panel */}
				<div className="p-4 rounded-xl shadow-lg h-full bg-white">
					Right content
				</div>
			</div>
		</div>
		<PharmacyFormModal
			isOpen={showPharmacyModal}
			onClose={() => setShowPharmacyModal(false)}
			onSubmit={(e) => {
				e.preventDefault();
				// gather form data and submit to API
				setShowPharmacyModal(false);
			}}
		/>
		<ContactFormModal
			isOpen={showContactModal}
			onClose={() => setShowContactModal(false)}
			onSubmit={(e) => {
				e.preventDefault();
				// gather form data and submit to API
				setShowContactModal(false);
			}}
		/>
		</>
	)
	function handleAdd(){
		if (activeTab === 'pharmacies') setShowPharmacyModal(true);
		else if (activeTab === 'contacts') setShowContactModal(true);
	}
}

export default Home