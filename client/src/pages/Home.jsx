import { useState, useEffect } from 'react';

import PharmacyFormModal from './modals/PharmacyFormModal';
import ContactFormModal from './modals/ContactFormModal';
import InfoPanel from './content/InfoPanel';
import config from '../config.js';

const serverIp = config.server_ip;
const serverPort = config.server_port;

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
	// Sidebar state
	const [showSidebar, setShowSidebar] = useState(window.innerWidth > 1024);

	// Functions for syncing data
	const fetchPharmacies = async () => {
		try {
			const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmacies`);
			const data = await res.json();
			setPharmacies(data);
		}
		catch (err) {
			console.error('Failed to fetch pharmacies', err);
		}
	};
	const fetchContacts = async () => {
		try {
			const res = await fetch(`http://${serverIp}:${serverPort}/api/contacts`);
			const data = await res.json();
			setContacts(data);
		}
		catch (err) {
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

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth <= 1024) setShowSidebar(false);
			else setShowSidebar(true);
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Filter lists
	const filteredPharmacies = pharmacies
		.slice()
		.sort((a, b) => a.name.localeCompare(b.name))
		.filter((pharmacy) =>
			pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
	const filteredContacts = contacts
		.slice()
		.sort((a, b) => a.name.localeCompare(b.name))
		.filter((contact) =>
			contact.name.toLowerCase().includes(searchTerm.toLowerCase())
		);

	return (
		<>
		<div className="flex h-screen p-1 bg-gray-600/80 min-w-100">
			{/* Open search menu */}
			<div className="absolute bottom-4 left-4 z-30 lg:hidden">
				<button
					tabIndex='-1'
					onClick={() => setShowSidebar(!showSidebar)}
					className="cursor-pointer p-2 bg-slate-600 hover:bg-slate-700 w-10 h-10 rounded-full font-bold shadow-md text-white"
				>
					⌕
				</button>
			</div>
			{/* Left Column */}
			{showSidebar && (
				<div className="m-1 bg-white shadow-xl overflow-auto scrollbar-thin lg:w-1/4 w-full rounded-xl">
					<div className="p-4 rounded-xl shadow-lg h-full bg-white flex flex-col">
						{/* Tab Buttons */}
						<div className="flex space-x-2 mb-4">
							<button
								tabIndex='-1'
								onClick={() => setActiveTab('pharmacies')}
								className={`cursor-pointer px-4 py-2 rounded-md w-1/2 shadow-sm ${
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
								className={`cursor-pointer px-4 py-2 rounded-md w-1/2 shadow-sm ${
									activeTab === 'contacts'
										? 'bg-cyan-900/70 text-white font-bold'
										: 'bg-gray-100 text-gray-400'
								}`}
							>
								Contacts
							</button>
						</div>
						<div className="flex space-x-1 h-10.5 mb-4">
							{/* Search Bar */}
							<input
								tabIndex='-1'
								id="search-bar"
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
								className="cursor-pointer w-12 h-10.5 text-4xl shadow-sm text-teal-600/60 font-medium border-2 border-teal-600/60 rounded-md hover:border-0 hover:text-white hover:bg-teal-600/60"
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
											onClick={() => {
												setSelectedItem({ ...pharmacy, type: 'pharmacy' });
												if (window.innerWidth <= 1024) setShowSidebar(false);
											}}
										>
											<p className="light-small">{pharmacy.verbal_orders ? '' : '⚠️NO VERBAL ORDERS'}</p>
											<p className="item-title">{pharmacy.name}</p>
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
											onClick={() => {
												setSelectedItem({ ...contact, type: 'contact' });
												if (window.innerWidth <= 1024) setShowSidebar(false);
											}}
										>
											<p className="light-small">{contact.dnc ? '❌DNC ' : ''}{contact.intake_only ? '⚠️INTAKE ONLY' : ''}</p>
											<p className="item-title" style={contact.dnc ? {color: 'rgba(200, 80, 80, 1)'} : contact.intake_only ? {color: 'rgba(210, 150, 20, 1)'} : {}}>{contact.name}</p>
											<p className="mt-[-4px]">{contact.title}</p>
											{contact.contact_type.length > 0 &&
												<div className="text-gray-400 text-sm flex flex-wrap gap-2 mt-1.5 mt-0.5">
													{(contact.contact_type).map((type) => (
														<div className="bg-gray-100 outline outline-gray-400 px-2 py-1 rounded-full shadow-sm" key={type}>{type}</div>
													))}
												</div>
											}
										</li>
									))}
								</ul>
							}
						</div>
					</div>
				</div>
			)}
			{/* Right Column */}
			<div className={`${showSidebar ? 'hidden lg:block lg:w-3/4' : 'w-full'} m-1`}>
				{/* Details panel */}
				<div className="p-4 rounded-xl shadow-lg h-full bg-white overflow-auto scrollbar-thin">
					<InfoPanel
						selectedItem={selectedItem}
						setSelectedItem={setSelectedItem}
					/>
				</div>
			</div>
		</div>
		{/* New pharmacy modal */}
		<PharmacyFormModal
			isOpen={showPharmacyModal}
			onClose={() => setShowPharmacyModal(false)}
			onSubmit={ async (e, selectedRules, selectedTrainings, selectedContacts) => {
				e.preventDefault();
				// Get form data
				const formData = new FormData(e.target);
				const newPharmacy = {
					name: formData.get('name')?.trim(),
					communication: formData.get('communication')?.trim(),
					verbal_orders: formData.get('verbal_orders') === 'on',
					general_notes: formData.get('general_notes')?.trim(),
					oncall_prefs: formData.get('oncall_prefs')?.trim(),
				};
				// Ensure data isn't blank
				if (!newPharmacy.name) {
					alert('Required fields cannot be blank.');
					return;
				}
				// Send info to db
				const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmacies`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newPharmacy),
				});
				const newPharm = await res.json();
				await associateRules(newPharm.id, selectedRules);
				await associateTraining(newPharm.id, selectedTrainings);
				await associateContact(newPharm.id, selectedContacts);
				fetchPharmacies();
				setShowPharmacyModal(false);
				// Display newly created item
				setSelectedItem({ ...newPharm, type: 'pharmacy' });
			}}
			contacts={contacts}
		/>
		{/* New contact modal */}
		<ContactFormModal
			isOpen={showContactModal}
			onClose={() => setShowContactModal(false)}
			onSubmit={ async (e, selectedPharmacies) => {
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
				// Ensure data isn't blank
				if (!newContact.name) {
					alert('Required fields cannot be blank.');
					return;
				}
				// Send info to db
				const res = await fetch(`http://${serverIp}:${serverPort}/api/contacts`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newContact),
				});
				const newCont = await res.json();
				await associatePharmacy(newCont.id, selectedPharmacies);
				fetchContacts();
				setShowContactModal(false);
				// Display newly created item
				setSelectedItem({ ...newCont, type: 'contact' });
			}}
			pharmacies={pharmacies}
		/>
		</>
	)
	// Determine which modal to display
	function handleAdd(){
		if (activeTab === 'pharmacies') setShowPharmacyModal(true);
		else if (activeTab === 'contacts') setShowContactModal(true);
	}

	// Update pharmacy_rules db based on selected rules
	async function associateRules(pharmId, ruleIds) {
		if (ruleIds.length == 0) return;
		// Send info to db
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmrules`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ pharmacy_id: pharmId, rule_ids: ruleIds }),
		});
	}

	// Update pharmacy_training db based on selected rules
	async function associateTraining(pharmId, trainingIds) {
		if (trainingIds.length == 0) return;
		// Send info to db
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmtraining`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ pharmacy_id: pharmId, training_ids: trainingIds }),
		});
	}

	// Update pharmacy_contacts db based on selected contacts
	async function associateContact(pharmId, contactIds) {
		if (contactIds.length == 0) return;
		// Send info to db
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmcontacts/contacts`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ pharmacy_id: pharmId, contact_ids: contactIds }),
		});
	}

	// Update pharmacy_contacts db based on selected pharmacies
	async function associatePharmacy(contactId, pharmacyIds) {
		if (pharmacyIds.length == 0) return;
		// Send info to db
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmcontacts/pharmacies`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ contact_id: contactId, pharmacy_ids: pharmacyIds }),
		});
	}
}

export default Home