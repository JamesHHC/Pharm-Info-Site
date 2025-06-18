// React
import React, { useState, useRef } from 'react';

// Content
import ModalPharmacies from './modal-content/ModalPharmacies';
import RichTextarea from '../components/RichTextarea';

// Styles
import './ModalStyles.css'

// Config
import config from '../../config.js';
const serverIp = config.server_ip;
const serverPort = config.server_port;

export default function ContactFormModal({ isOpen, onClose, onSubmit, pharmacies }) {
	// For tracking selected options
	const [selectedPharmacies, setSelectedPharmacies] = useState([]);

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
		const newContact = {
			name: formData.get('name')?.trim(),
			email: formData.get('email')?.trim(),
			phone: formData.get('phone')?.trim(),
			title: formData.get('title')?.trim(),
			preferences: formData.get('preferences'),
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
		await onSubmit(e, newCont);
		resetForm();
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-[5px] flex items-center justify-center z-40">
			<div className="bg-white p-6 rounded-lg shadow-2xl w-150 max-h-[90vh] overflow-y-auto scrollbar-thin">
				<p className="modal-title mb-4">Add New Contact</p>
				<form onSubmit={handleSubmit}>
					
					{/* Contact Name */}
					<label htmlFor="name" className="block text-sm font-light text-gray-700 mb-1">
						Contact Name <span className="text-red-500">*</span>
					</label>
					<input
						required id="name" name="name" type="text" placeholder="Type here..." autoComplete="off"
						className="w-full mb-3 border border-gray-300 p-2 rounded focus:outline-cyan-500/60"
					/>

					{/* DNC/Intake-Only */}
					<div className="flex items-center mb-1.5">
						<input 
							tabIndex="-1" id="dnc" name="dnc" type="checkbox"
							className="appearance-none flex-none custom-chk transition border-1 border-gray-300 w-5 h-5 focus:outline-cyan-500/60 checked:border-0 checked:bg-cyan-800 rounded-full"
						/>
						<label htmlFor="dnc" className="block text-sm p-2 items mr-4">❌DNC</label>
						<input 
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
									className="appearance-none flex-none custom-chk transition border-1 border-gray-300 mr-2 w-5 h-5 focus:outline-cyan-500/60 checked:border-0 checked:bg-cyan-800 pointer-events-none rounded-full"
								/>
								<span className="text-sm">{type}</span>
							</label>
						))}
					</div>

					{/* Title */}
					<label htmlFor="title" className="block text-sm font-light text-gray-700 mb-1">Title</label>
					<input
						id="title" name="title" type="text" placeholder="Type here..." autoComplete="off"
						className="w-full mb-3 border border-gray-300 p-2 rounded focus:outline-cyan-500/60"
					/>

					{/* Contact Info */}
					<div className="sm:flex">
						{/* Email */}
						<div className="w-full mr-3">
							<label htmlFor="email" className="block text-sm font-light text-gray-700 mb-1">Email</label>
							<input
								id="email" name="email" type="text" placeholder="Type here..." autoComplete="off"
								className="w-full mb-3 border border-gray-300 p-2 rounded focus:outline-cyan-500/60"
							/>
						</div>
						{/* Phone Number */}
						<div className="w-full">
							<label htmlFor="phone" className="block text-sm font-light text-gray-700 mb-1">Phone Number</label>
							<input
								id="phone" name="phone" type="text" placeholder="Type here..." autoComplete="off"
								className="w-full mb-3 border border-gray-300 p-2 rounded focus:outline-cyan-500/60"
							/>
						</div>
					</div>

					{/* Preferences */}
					<RichTextarea
						id="preferences"
						name="preferences"
						label="Preferences"
					/>

					{/* Pharmacies */}
					< ModalPharmacies
						ref={pharmaciesRef}
						selectedPharmacies={selectedPharmacies}
						setSelectedPharmacies={setSelectedPharmacies}
						pharmacies={pharmacies}
					/>
					
					{/* Cancel/Submit Buttons */}
					<div className="flex justify-end space-x-2">
						<button type="button" onClick={() => {onClose(); resetForm();}} className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-400 hover:bg-gray-300 rounded focus:outline-cyan-500/60">Cancel</button>
						<button type="submit" className="cursor-pointer px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded focus:outline-cyan-500/60">Submit</button>
					</div>

				</form>
			</div>
		</div>
	);

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