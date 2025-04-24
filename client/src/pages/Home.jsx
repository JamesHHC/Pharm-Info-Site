import { useState, useEffect } from 'react';

import PharmacyFormModal from './modals/PharmacyFormModal';
import ContactFormModal from './modals/ContactFormModal';
import InfoPanel from './content/InfoPanel';

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
	// Selected list item
	const [selectedItem, setSelectedItem] = useState(null);

	// Functions for syncing data
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

	// Sync lists to db
	useEffect(() => {
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
		<div className="flex h-screen p-1 bg-gray-600/80 min-w-[1100px]">
			<div className="w-1/4 p-1">
				{/* Left Column with Tabs */}
				<div className="p-4 rounded-xl shadow-lg h-full bg-white flex flex-col">
					{/* Tab Buttons */}
					<div className="flex space-x-2 mb-4">
						<button
							tabIndex='-1'
							onClick={() => setActiveTab('pharmacies')}
							className={`px-4 py-2 rounded-md w-1/2 shadow-sm ${
								activeTab === 'pharmacies'
									? 'bg-cyan-900/70 text-white font-bold'
									: 'bg-gray-100 text-gray-400'
							}`}
						>
							Pharmacies
						</button>
						<button
							tabIndex='-1'
							onClick={() => setActiveTab('contacts')}
							className={`px-4 py-2 rounded-md w-1/2 shadow-sm ${
								activeTab === 'contacts'
									? 'bg-cyan-900/70 text-white font-bold'
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
							className="h-full w-full px-4 border border-gray-300 rounded-md focus:outline-cyan-500/60 shadow-sm"
						/>
						{/* Create Button */}
						<button
							tabIndex='-1'
							onClick={handleAdd}
							className="w-12 h-10.5 text-4xl shadow-sm text-green-500/80 font-medium border-2 border-green-500/80 rounded-md hover:text-white hover:bg-green-500/80"
						>
							<span className="relative bottom-[5px]">+</span>
						</button>
					</div>
					{/* Tab Content */}
					<div tabIndex='-1' className="flex-1 overflow-auto rounded-md scrollbar-thin p-2 bg-gray-200 border border-gray-200 shadow-sm">
						{/* Pharmacy list */}
						{ activeTab === 'pharmacies' &&
							<ul className="space-y-2">
								{filteredPharmacies.map((pharmacy) => (
									<li
										key={pharmacy.id}
										className="p-2 bg-white rounded-md hover:bg-white/70 cursor-pointer shadow-sm"
										onClick={() => setSelectedItem(pharmacy)}
									>
										<h2>{pharmacy.name}</h2>
										<h5>{pharmacy.verbal_orders ? '' : '⚠️NO VERBAL ORDERS'}</h5>
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
										className="p-2 bg-white rounded-md hover:bg-white/70 cursor-pointer shadow-sm"
										onClick={() => setSelectedItem(contact)}
									>
										<h2 style={contact.dnc ? {color: 'rgba(200, 80, 80, 1)'} : contact.intake_only ? {color: 'rgba(210, 150, 20, 1)'} : {}}>{contact.name}</h2>
										<h5>{contact.dnc ? '❌DNC ' : ''}{contact.intake_only ? '⚠️INTAKE ONLY' : ''}</h5>
										{contact.contact_type &&
											<div className="text-gray-400 text-sm flex flex-wrap gap-2 mt-1.5 mt-0.5">
												{(contact.contact_type).map((type) => (
													<div className="bg-gray-100 outline outline-gray-400 px-2 py-1 rounded-full shadow-sm" key={type}>{type}</div>
												))}
											</div>
										}
										<p>{contact.email}</p>
										<p>{contact.phone}</p>
									</li>
								))}
							</ul>
						}
					</div>
				</div>
			</div>
			<div className="w-3/4 p-1">
				{/* Details panel */}
				<div className="p-4 rounded-xl shadow-lg h-full bg-white overflow-auto scrollbar-thin">
					<InfoPanel selectedItem={selectedItem} />
				</div>
			</div>
		</div>
		{/* New pharmacy modal */}
		<PharmacyFormModal
			isOpen={showPharmacyModal}
			onClose={() => setShowPharmacyModal(false)}
			onSubmit={ async (e) => {
				e.preventDefault();
				// Get form data
				const formData = new FormData(e.target);
				const newPharmacy = {
					name: formData.get('name')?.trim(),
					communication: formData.get('communication')?.trim(),
					verbal_orders: formData.get('verbal_orders') === 'on',
					general_notes: formData.get('general_notes')?.trim(),
					oncall_prefs: formData.get('oncall_prefs')?.trim(),
					rules: [],
					training_reg: [],
				};
				// Ensure data isn't blank
				if (!newPharmacy.name) {
					alert('Required fields cannot be blank.');
					return;
				}
				// Send info to db
				const res = await fetch('http://localhost:5000/api/pharmacies', {
				  method: 'POST',
				  headers: { 'Content-Type': 'application/json' },
				  body: JSON.stringify(newPharmacy),
				});
				const newPharm = await res.json();
				// console.log(newPharm);
				fetchPharmacies();
				setShowPharmacyModal(false);
			}}
		/>
		{/* New contact modal */}
		<ContactFormModal
			isOpen={showContactModal}
			onClose={() => setShowContactModal(false)}
			onSubmit={ async (e) => {
				e.preventDefault();
				// Get form formData
				const formData = new FormData(e.target);
				const newContact = {
					name: formData.get('name')?.trim(),
					email: formData.get('email')?.trim(),
					phone: formData.get('phone')?.trim(),
					title: formData.get('title')?.trim(),
					preferences: formData.get('preferences')?.trim(),
					dnc: formData.get('dnc') === 'on',
					intake_only: formData.get('intake_only') === 'on',
					contact_type: formData.getAll('contact_type'),
				}
				// Send info to db
				const res = await fetch('http://localhost:5000/api/contacts', {
				  method: 'POST',
				  headers: { 'Content-Type': 'application/json' },
				  body: JSON.stringify(newContact),
				});
				const newCont = await res.json();
				// console.log(newCont);
				fetchContacts();
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