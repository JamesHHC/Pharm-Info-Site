// React
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';

// Styles
import '../ModalStyles.css';

// Config
import config from '../../../config.js';
const serverIp = config.server_ip;
const serverPort = config.server_port;

const ModalContacts = forwardRef(({selectedContacts, setSelectedContacts, contacts}, ref) => {
	const [searchedContact, setSearchedContact] = useState('');

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
		.filter((contact) =>
			contact.name.toLowerCase().includes(searchedContact.toLowerCase())
		);

	return (<>
		{/* Contacts */}
		<p className="block text-sm font-light text-gray-700 mb-1">Contacts</p>
		{/* Contacts search bar */}
		<input
			id="contacts-search-bar"
			type="text"
			placeholder="Search contacts..."
			value={searchedContact}
			onChange={(e) => setSearchedContact(e.target.value)}
			className="flex mb-1 h-10.5 w-full px-4 border border-gray-300 rounded-md focus:outline-cyan-500/60"
			autoComplete="off"
		/>
		{/* Contacts List */}
		<div tabIndex="-1" className="resize-y mb-4 border bg-gray-100 border-gray-300 p-2 rounded h-40 w-full overflow-y-auto overflow-x-hidden space-y-2 space-x-2 scrollbar-thin">
			{filteredContacts.map((contact) => {
				const isVisible = contact.name.toLowerCase().includes(searchedContact.toLowerCase());
				return (
					<div
						className={`bg-white flex w-full items-center justify-between rounded-md shadow-sm ${!isVisible ? 'hidden' : ''}`}
						key={contact.name}
					>
						<label htmlFor={`contact_${contact.id}`} className="w-full p-2">
							<div className="flex items-center">
								<input
									tabIndex="-1"
									type="checkbox"
									id={`contact_${contact.id}`}
									name="contact"
									value={contact.id}
									checked={selectedContacts.includes(contact.id)}
									onChange={() => handleContactChange(contact.id)}
									className="appearance-none flex-none custom-chk transition border-1 border-gray-300 mr-2 w-5 h-5 focus:outline-cyan-500/60 checked:border-0 checked:bg-cyan-800 pointer-events-none rounded-full"
								/>
								{/* Contact info */}
								<div className="flex-block">
									<p className="text-sm">{contact.name}</p>
									<p className="text-sm font-light">{contact.title}</p>
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