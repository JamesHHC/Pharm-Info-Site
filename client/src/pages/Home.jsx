// React
import { useState, useEffect } from 'react';

// Auth
import { useAuth } from '../auth/AuthContext';
import { hasMinPermission } from '../auth/checkRole';

// Content
import PharmacyFormModal from './modals/PharmacyFormModal';
import ContactFormModal from './modals/ContactFormModal';
import InfoPanel from './content/InfoPanel';
import PharmacyEditModal from './modals/PharmacyEditModal';
import ContactEditModal from './modals/ContactEditModal';
import UserModal from './modals/UserModal';

// Assets
import logo from '../assets/logo_bluegray.svg';
import UserIcon from '../assets/icons/UserIcon';
import ArchiveFilledIcon from '../assets/icons/ArchiveFilledIcon';

// Config
import config from '../config.js';
const serverIp = config.server_ip;
const serverPort = config.server_port;

function Home() {
	// User/auth stuff
	const { user, setUser } = useAuth();

	// For tabs/search bar
	const [activeTab, setActiveTab] = useState('pharmacies');
	const [searchTerm, setSearchTerm] = useState('');

	// For pharmacy/contact lists
	const [pharmacies, setPharmacies] = useState([]);
	const [contacts, setContacts] = useState([]);

	// For modals
	const [showPharmacyModal, setShowPharmacyModal] = useState(false);
	const [showContactModal, setShowContactModal] = useState(false);
	const [showPharmacyEditModal, setShowPharmacyEditModal] = useState(false);
	const [showContactEditModal, setShowContactEditModal] = useState(false);
	const [showUserModal, setShowUserModal] = useState(false);

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
			if (window.innerWidth > 1024) setShowSidebar(true);
		};
		if (!selectedItem) setShowSidebar(true);
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

	return (<>
		<div className="flex h-screen p-1 bg-gray-600/80 min-w-[255px]">
			{/* Open search menu button */}
			<div className="absolute bottom-4 left-4 z-30 lg:hidden">
				<button
					tabIndex='-1'
					onClick={() => setShowSidebar(!showSidebar)}
					className="cursor-pointer p-2 shadow-md bg-slate-600 hover:bg-slate-700 w-10 h-10 rounded-full font-bold text-white"
				>
					{showSidebar ? '↺' : '⌕'}
				</button>
			</div>
			{/* Left Column */}
			{showSidebar && (
				<div className="m-1 bg-white shadow-xl overflow-auto scrollbar-thin lg:w-1/4 w-full rounded-xl">
					<div className="p-4 rounded-xl shadow-lg h-full bg-white flex flex-col">
						{/* Header section */}
						<div className="flex mb-4">
							{/* HHC logo */}
							<img src={logo} alt="logo" className="h-14"/>
							{/* Profile icon */}
							<div
								onClick={() => setShowUserModal(true)}
								className={`${user ? 'bg-cyan-800/30 hover:bg-cyan-800/40' : 'hover:bg-gray-200/70'} flex cursor-pointer ml-auto my-auto h-10 w-10 rounded-full border-2 border-slate-700/70`}
							>
								<p className="noselect m-auto text-slate-700/70"><UserIcon/></p>
							</div>
						</div>
						{/* Tab Buttons */}
						<div className="flex space-x-2 mb-3">
							<button
								tabIndex='-1'
								onClick={() => setActiveTab('pharmacies')}
								className={`cursor-pointer py-2 rounded-md w-1/2 ${
									activeTab === 'pharmacies'
										? 'bg-cyan-900/70 text-white font-bold shadow-sm'
										: 'bg-gray-100 text-gray-400 shadow-sm outline outline-gray-300'
								}`}
							>
								Pharmacies
							</button>
							<button
								tabIndex='-1'
								onClick={() => setActiveTab('contacts')}
								className={`cursor-pointer py-2 rounded-md w-1/2 ${
									activeTab === 'contacts'
										? 'bg-cyan-900/70 text-white font-bold shadow-sm'
										: 'bg-gray-100 text-gray-400 shadow-sm outline outline-gray-300'
								}`}
							>
								Contacts
							</button>
						</div>
						<div className="flex space-x-1 h-10.5 mb-3">
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
							{hasMinPermission(user, 'editor') && <button
								tabIndex='-1'
								onClick={handleAdd}
								className="cursor-pointer w-12 h-10.5 text-4xl shadow-sm text-teal-600/60 font-medium border-2 border-teal-600/60 rounded-md hover:border-0 hover:text-white hover:bg-teal-600/60"
							>
								<span className="relative bottom-[5px]">+</span>
							</button>}
						</div>
						{/* Tab Content */}
						<div tabIndex='-1' className="flex-1 overflow-auto rounded-md scrollbar-hidden p-2 bg-gray-200/70 border border-gray-300 inset-shadow-sm">
							{/* Pharmacy list */}
							{ activeTab === 'pharmacies' &&
								<ul className="space-y-2">
									{filteredPharmacies.map((pharmacy) => {
										const isActive = pharmacy.active;
										const thisPharmacy = selectedItem?.type === 'pharmacy' && selectedItem?.id === pharmacy.id;
										if (!isActive && !hasMinPermission(user, 'editor')) return;
										return (
											<li
												key={pharmacy.id}
												className={`${thisPharmacy ? 'outline-gray-700/40 outline-2' : 'outline-gray-300'} ${isActive || 'opacity-30'} p-2 bg-white hover:bg-white/50 rounded-md cursor-pointer shadow-sm outline`}
												onClick={() => {
													setSelectedItem({ ...pharmacy, type: 'pharmacy' });
													if (window.innerWidth <= 1024) setShowSidebar(false);
												}}
											>	
												<div className="flex">
													<div>
														<p className="light-small">{pharmacy.verbal_orders ? '' : '⚠️NO VERBAL ORDERS'}</p>
														<p className="item-title">{pharmacy.name}</p>
													</div>
													{isActive || <div className="my-auto ml-auto mr-2"><ArchiveFilledIcon/></div>}
												</div>
											</li>
										);
									})}
								</ul>
							}
							{/* Contact list */}
							{ activeTab === 'contacts' &&
								<ul className="space-y-2">
									{filteredContacts.map((contact) => {
										const isActive = contact.active;
										const thisContact = selectedItem?.type === 'contact' && selectedItem?.id === contact.id;
										if (!isActive && !hasMinPermission(user, 'editor')) return;
										return (
											<li
												key={contact.id}
												className={`${thisContact ? 'outline-gray-700/40 outline-2' : 'outline-gray-300'} ${isActive || 'opacity-30'} p-2 bg-white hover:bg-white/50 rounded-md cursor-pointer shadow-sm outline`}
												onClick={() => {
													setSelectedItem({ ...contact, type: 'contact' });
													if (window.innerWidth <= 1024) setShowSidebar(false);
												}}
											>
												<div className="flex">
													<div>
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
													</div>
													{isActive || <div className="my-auto ml-auto mr-2"><ArchiveFilledIcon/></div>}
												</div>
											</li>
										);
									})}
								</ul>
							}
						</div>
					</div>
				</div>
			)}
			{/* Right Column */}
			<div className={`${showSidebar ? 'hidden lg:block lg:w-3/4' : 'w-full'} m-1`}>
				<div className="p-4 rounded-xl shadow-lg h-full bg-white">
					{/* Information for pharmacy/contact */}
					<InfoPanel
						selectedItem={selectedItem}
						setSelectedItem={setSelectedItem}
						editItem={ async () => {
							selectedItem.type === 'pharmacy' ? 
								setShowPharmacyEditModal(true) :
								setShowContactEditModal(true);
						}}
					/>
				</div>
			</div>
		</div>

		{/* User modal */}
		<UserModal
			isOpen={showUserModal}
			user={user}
			setUser={setUser}
			onClose={(clearSelected) => {
				setShowUserModal(false);
				// Remove selected item in case of change in user
				if (clearSelected) setSelectedItem(null);
			}}
		/>

		{/* Edit pharmacy modal */}
		<PharmacyEditModal
			isOpen={showPharmacyEditModal}
			onClose={() => {
				setShowPharmacyEditModal(false);
				fetchPharmacies();
			}}
			onSubmit={ async (e, updatedPharm) => {
				e.preventDefault();
				setShowPharmacyEditModal(false);
				setSelectedItem({ ...updatedPharm, type: 'pharmacy' });
			}}
			contacts={contacts}
			openPharmacy={selectedItem}
			setSelectedItem={setSelectedItem}
		/>

		{/* Edit contact modal */}
		<ContactEditModal
			isOpen={showContactEditModal}
			onClose={() => {
				setShowContactEditModal(false);
				fetchContacts();
			}}
			onSubmit={ async (e, updatedCont) => {
				e.preventDefault();
				setShowContactEditModal(false);
				setSelectedItem({ ...updatedCont, type: 'contact' });
			}}
			pharmacies={pharmacies}
			openContact={selectedItem}
			setSelectedItem={setSelectedItem}
		/>

		{/* New pharmacy modal */}
		<PharmacyFormModal
			isOpen={showPharmacyModal}
			onClose={() => setShowPharmacyModal(false)}
			onSubmit={ async (e, newPharm) => {
				e.preventDefault();
				fetchPharmacies();
				setShowPharmacyModal(false);
				setSelectedItem({ ...newPharm, type: 'pharmacy' });
			}}
			contacts={contacts}
		/>

		{/* New contact modal */}
		<ContactFormModal
			isOpen={showContactModal}
			onClose={() => setShowContactModal(false)}
			onSubmit={ async (e, newCont) => {
				e.preventDefault();
				fetchContacts();
				setShowContactModal(false);
				setSelectedItem({ ...newCont, type: 'contact' });
			}}
			pharmacies={pharmacies}
		/>
	</>);

	// Determine which modal to display
	function handleAdd(){
		if (activeTab === 'pharmacies') setShowPharmacyModal(true);
		else if (activeTab === 'contacts') setShowContactModal(true);
	}
}

export default Home