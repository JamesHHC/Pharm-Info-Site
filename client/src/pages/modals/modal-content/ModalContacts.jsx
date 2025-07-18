// React
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';

// Auth
import { useAuth } from '@/auth/AuthContext';
import { hasMinPermission } from '@/auth/checkRole';

// Styles
import '@/pages/modals/ModalStyles.css';

// Assets
import ArchiveFilledIcon from '@/assets/icons/ArchiveFilledIcon';
import CrownIcon from '@/assets/icons/CrownIcon';

// Config
import config from '@/config.js';
const serverIp = config.server_ip;
const serverPort = config.server_port;

const ModalContacts = forwardRef(({selectedContacts, setSelectedContacts, contacts}, ref) => {
	// User/auth stuff
	const { user } = useAuth();

	const [searchedContact, setSearchedContact] = useState('');
	const [selectedOnly, setSelectedOnly] = useState(false);

	// Reset fields w/in form
	const resetContactsForm = () => {
		// Reset contact stuff
		setSearchedContact('');
		setSelectedContacts([]);
	};

	useImperativeHandle(ref, () => ({
        resetContactsForm
    }));

	// Keep track of selected contacts during filtering
	const handleContactChange = (id) => {
		setSelectedContacts(prevSelected =>
			prevSelected.includes(id)
				? prevSelected.filter(cid => cid !== id)
				: [...prevSelected, id]
		);
	};

	// Filter contacts based on user input
	const filteredContacts = contacts
		.slice()
		.sort((a, b) => a.name.localeCompare(b.name))
		.filter((contact) => {
			if (selectedOnly && !selectedContacts.includes(contact.id)) return false;
			return contact.name.toLowerCase().includes(searchedContact.toLowerCase());
		});

	return (<>
		{/* Contacts */}
		<p className="block text-sm font-light text-gray-700 mb-1">Contacts</p>
		{/* Contacts search bar */}
		<div className="flex">
			<input
				id="contacts-search-bar"
				type="text"
				placeholder="Search contacts..."
				value={searchedContact}
				onChange={(e) => setSearchedContact(e.target.value)}
				className="flex mb-1 h-10.5 w-full px-4 border border-gray-300 rounded-l-md focus:outline-cyan-500/60"
				autoComplete="off"
			/>
			<button
				id="selected-only"
				type="button"
				onClick={() => setSelectedOnly(!selectedOnly)}
				className={`${selectedOnly ? 'bg-cyan-500/60 text-white font-bold' : 'bg-gray-100 text-gray-400'} border-y border-r border-gray-300 rounded-r-md h-10.5 px-2`}
			>
				✓
			</button>
		</div>
		{/* Contacts List */}
		<div tabIndex="-1" className="resize-y mb-4 border bg-gray-100 border-gray-300 p-2 rounded h-40 w-full overflow-y-auto overflow-x-hidden space-y-2 space-x-2 scrollbar-thin">
			{filteredContacts.map((contact) => {
				const isActive = contact?.active;
				return (
					<div
						className="bg-white flex w-full items-center justify-between rounded-md shadow-sm"
						key={contact.name}
					>
						<label htmlFor={`contact_${contact.id}`} className="w-full p-2">
							<div className="flex items-center">
								<input
									tabIndex="-1"
									disabled={(!isActive && !hasMinPermission(user, 'admin creator')) || (contact.vip && !hasMinPermission(user, 'admin'))}
									type="checkbox"
									id={`contact_${contact.id}`}
									name="contact"
									value={contact.id}
									checked={selectedContacts?.includes(contact.id) ?? false}
									onChange={() => handleContactChange(contact.id)}
									className="appearance-none flex-none custom-chk transition border-1 border-gray-300 mr-2 w-5 h-5 focus:outline-cyan-500/60 checked:border-0 checked:bg-cyan-800 pointer-events-none rounded-full"
								/>
								{/* Contact info */}
								<div className="flex w-full">
									<div>
										<p className={`${contact?.active || 'opacity-30 line-through'} text-sm`}>
											{contact.name}
											{contact.vip &&
												<span
													className="ml-1 mr-3 mt-[-4px]"
													style={{
														display: 'inline-block',
												        width: '1em',
												        height: '1em',
												        verticalAlign: 'text-center',
													}}
												>
													<CrownIcon w='18px' h='18px'/>
												</span>
											}
										</p>
										<p className={`${contact?.active || 'opacity-30'} text-sm font-light`}>{contact.title}</p>
									</div>
									{contact?.active || <div className="my-auto ml-auto mr-2 text-red-600"><ArchiveFilledIcon w="16" h="16"/></div>}
								</div>
							</div>
						</label>
					</div>
				);
			})}
		</div>
	</>);
});

export default ModalContacts;