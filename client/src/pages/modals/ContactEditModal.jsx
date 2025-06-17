// React
import React, { useEffect, useState, useRef } from 'react';

// Content
import ModalPharmacies from './modal-content/ModalPharmacies';
import TrashIcon from '../../assets/icons/TrashIcon';
import RichTextarea from '../components/RichTextarea';

// Styles
import './ModalStyles.css'

// Config
import config from '../../config.js';
const serverIp = config.server_ip;
const serverPort = config.server_port;

export default function ContactFormModal({ isOpen, onClose, onSubmit, pharmacies, openContact, setSelectedItem }) {
	// For tracking form values
	const [contName, setContName] = useState('');
	const [contDNC, setContDNC] = useState(false);
	const [contIntake, setContIntake] = useState(false);
	const [contTypes, setContTypes] = useState([]);
	const [contTitle, setContTitle] = useState('');
	const [contEmail, setContEmail] = useState('');
	const [contPhone, setContPhone] = useState('');
	const [contPrefs, setContPrefs] = useState('');
	// For tracking selected options
	const [selectedPharmacies, setSelectedPharmacies] = useState([]);

	// RichText references
	const prefRef = useRef();

	// Set form values based on existing ones
	useEffect(() => {
		// TODO (low-priority): Auto-resize textareas for better UX once production-ready
		const initValues = async () => {
			setContName(openContact.name);
			setContDNC(openContact?.dnc || false);
			setContIntake(openContact?.intake_only || false);
			setContTypes(openContact?.contact_type || []);
			setContTitle(openContact?.title || '');
			setContEmail(openContact?.email || '');
			setContPhone(openContact?.phone || '');

			// Preferences
			setContPrefs(openContact?.preferences || '');
			prefRef.current?.setVal(openContact?.preferences || '');

			if (pharmacies.length > 0) setSelectedPharmacies(await getContPharms(openContact.id));
			else setSelectedPharmacies([]);
		}
		if (isOpen) initValues();
	}, [isOpen]);

	// References
	const pharmaciesRef = useRef();

	// Reset fields w/in form
	const resetForm = () => {
		pharmaciesRef.current?.resetPharmaciesForm();
	};

	// Run when form submitted
	const handleSubmit = async (e) => {
		e.preventDefault();
		// Get form data
		const formData = new FormData(e.target);
		const updatedContact = {
			id: openContact.id,
			name: contName.trim(),
			email: contEmail?.trim(),
			phone: contPhone?.trim(),
			title: contTitle?.trim(),
			preferences: contPrefs?.trim(),
			dnc: contDNC,
			intake_only: contIntake,
			contact_type: contTypes,
		}
		// Ensure data isn't blank
		if (!updatedContact.name) {
			alert('Required fields cannot be blank.');
			return;
		}
		// Send info to db
		const res = await fetch(`http://${serverIp}:${serverPort}/api/contacts`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updatedContact),
		});
		const updatedCont = await res.json();
		await associatePharmacy(updatedCont.id, selectedPharmacies);
		await onSubmit(e, updatedCont);
		resetForm();
		onClose();
	};

	// Delete the contact currently being edited
	const deleteContact = async () => {
		const id = openContact.id;
		const conf = confirm(`Are you sure you want to delete this contact?\n\n${openContact.name}`);
		if (conf) {
			// Call db to delete data
			await fetch(`http://${serverIp}:${serverPort}/api/contacts?id=${id}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
			});
			setSelectedItem(null);
			resetForm();
			onClose();
		}
	};

	// Keep types array up to date with selections
	const updateContactTypes = (e) => {
		const { value, checked } = e.target;
		setContTypes((prev) =>
			checked ? [...prev, value] : prev.filter((v) => v !== value)
		);
	};

	if (!isOpen || openContact.type != "contact") return null;

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-[5px] flex items-center justify-center z-40">
			<div className="bg-white outline-3 outline-amber-500/60 p-6 rounded-lg shadow-2xl w-150 max-h-[90vh] overflow-y-auto scrollbar-thin">
				<p className="text-3xl font-bold mb-4 text-orange-900/70">Edit Contact</p>
				<form onSubmit={handleSubmit}>
					
					{/* Contact Name */}
					<label htmlFor="name" className="block text-sm font-light text-gray-700 mb-1">
						Contact Name <span className="text-red-500">*</span>
					</label>
					<input
						value={contName} onChange={(e) => setContName(e.target.value)}
						required id="name" name="name" type="text" placeholder="Type here..." autoComplete="off"
						className="w-full mb-3 border border-gray-300 p-2 rounded focus:outline-cyan-500/60"
					/>

					{/* DNC/Intake-Only */}
					<div className="flex items-center mb-1.5">
						<input
							checked={contDNC} onChange={(e) => setContDNC(e.target.checked)}
							tabIndex="-1" id="dnc" name="dnc" type="checkbox"
							className="appearance-none flex-none custom-chk transition border-1 border-gray-300 w-5 h-5 focus:outline-cyan-500/60 checked:border-0 checked:bg-cyan-800 rounded-full"
						/>
						<label htmlFor="dnc" className="block text-sm p-2 items mr-4">❌DNC</label>
						<input
							checked={contIntake} onChange={(e) => setContIntake(e.target.checked)}
							tabIndex="-1" id="intake_only" name="intake_only" type="checkbox"
							className="appearance-none flex-none custom-chk transition border-1 border-gray-300 w-5 h-5 focus:outline-cyan-500/60 checked:border-0 checked:bg-cyan-800 rounded-full"
						/>
						<label htmlFor="intake_only" className="block text-sm p-2 items">⚠️Intake Only</label>
					</div>

					{/* Contact Type */}
					<p className="block text-sm font-light text-gray-700 mb-1">Contact Type</p>
					<div tabIndex="-1" className="flex-wrap bg-gray-100 resize-y mb-3 border border-gray-300 p-2 rounded h-24 w-full overflow-auto space-x-2 space-y-2 scrollbar-thin">
						{['Accounts Receivable', 'Care Coordination', 'Clinical', 'Compliance', 'Documentation', 'Executive', 'Intake', 'On-call'].map((type) => (
							<label htmlFor={`contact_type_${type}`} key={type} className="flex-none inline-flex items-center bg-white p-2 shadow-sm rounded-full">
								<input
									tabIndex="-1"
									type="checkbox"
									id={`contact_type_${type}`}
									name="contact_type"
									value={type}
									checked={contTypes.includes(type)}
      								onChange={updateContactTypes}
									className="appearance-none flex-none custom-chk transition border-1 border-gray-300 mr-2 w-5 h-5 focus:outline-cyan-500/60 checked:border-0 checked:bg-cyan-800 pointer-events-none rounded-full"
								/>
								<span className="text-sm">{type}</span>
							</label>
						))}
					</div>

					{/* Title */}
					<label htmlFor="title" className="block text-sm font-light text-gray-700 mb-1">Title</label>
					<input
						value={contTitle} onChange={(e) => setContTitle(e.target.value)}
						id="title" name="title" type="text" placeholder="Type here..." autoComplete="off"
						className="w-full mb-3 border border-gray-300 p-2 rounded focus:outline-cyan-500/60"
					/>

					{/* Email */}
					<label htmlFor="email" className="block text-sm font-light text-gray-700 mb-1">Email</label>
					<input
						value={contEmail} onChange={(e) => setContEmail(e.target.value)}
						id="email" name="email" type="text" placeholder="Type here..." autoComplete="off"
						className="w-full mb-3 border border-gray-300 p-2 rounded focus:outline-cyan-500/60"
					/>

					{/* Phone Number */}
					<label htmlFor="phone" className="block text-sm font-light text-gray-700 mb-1">Phone Number</label>
					<input
						value={contPhone} onChange={(e) => setContPhone(e.target.value)}
						id="phone" name="phone" type="text" placeholder="Type here..." autoComplete="off"
						className="w-full mb-3 border border-gray-300 p-2 rounded focus:outline-cyan-500/60"
					/>

					{/* Preferences */}
					<RichTextarea 
						id="preferences"
						name="preferences"
						label="Preferences"
						ref={prefRef}
						onChange={(e) => setContPrefs(e)}
					/>

					{/* Pharmacies */}
					< ModalPharmacies
						ref={pharmaciesRef}
						selectedPharmacies={selectedPharmacies}
						setSelectedPharmacies={setSelectedPharmacies}
						pharmacies={pharmacies}
					/>
					
					{/* Cancel/Submit Buttons */}
					<div className="flex justify-end">
						<button tabIndex="-1" type="button" onClick={deleteContact} className="cursor-pointer mr-auto px-4 py-2 bg-red-800/20 text-red-900 hover:bg-red-800/30 rounded-md">
							<TrashIcon className="my-auto"/>
						</button>
						<button type="button" onClick={() => {onClose(); resetForm();}} className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-400 hover:bg-gray-300 rounded-l-md focus:outline-amber-500/60">Cancel</button>
						<button type="submit" className="cursor-pointer px-4 py-2 bg-orange-600/60 hover:bg-orange-600/80 text-white rounded-r-md focus:outline-amber-500/60">Save</button>
					</div>

				</form>
			</div>
		</div>
	);

	// Update pharmacy_contacts db based on selected pharmacies
	async function associatePharmacy(contactId, pharmacyIds) {
		// Send info to db
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmcontacts/pharmacies`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ contact_id: contactId, pharmacy_ids: pharmacyIds }),
		});
	}

	// Return IDs of pharmacies for given contact ID
	async function getContPharms(id) {
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmcontacts/pharmacies?contact_id=${id}`);
		const data = await res.json();
		return data.map(p => p.pharmacy_id);
	}
}