// React
import React, { useEffect, useState, useRef } from 'react';

// Auth
import { useAuth } from '../../auth/AuthContext';

// Content
import ModalRules from './modal-content/ModalRules';
import ModalTrainings from './modal-content/ModalTrainings';
import ModalBlurbs from './modal-content/ModalBlurbs';
import ModalContacts from './modal-content/ModalContacts';
import RichTextarea from '../components/RichTextarea';

// Styles
import './ModalStyles.css'

// Config
import config from '../../config.js';
const serverIp = config.server_ip;
const serverPort = config.server_port;

export default function PharmacyFormModal({ isOpen, onClose, onSubmit, contacts }) {
	// User/auth stuff
	const { user } = useAuth();
	
	// For tracking selected options
	const [selectedRules, setSelectedRules] = useState([]);
	const [selectedTrainings, setSelectedTrainings] = useState([]);
	const [selectedBlurbs, setSelectedBlurbs] = useState([]);
	const [selectedContacts, setSelectedContacts] = useState([]);

	// References
	const rulesRef = useRef();
	const trainingsRef = useRef();
	const blurbsRef = useRef();
	const contactsRef = useRef();

	// Reset fields w/in form
	const resetForm = () => {
		rulesRef.current?.resetRulesForm();
		trainingsRef.current?.resetTrainingsForm();
		blurbsRef.current?.resetBlurbsForm();
		contactsRef.current?.resetContactsForm();
	};

	// Run when form submitted
	const handleSubmit = async (e) => {
		e.preventDefault();
		// Get form data
		const formData = new FormData(e.target);
		const newPharmacy = {
			name: formData.get('name')?.trim(),
			communication: formData.get('communication'),
			verbal_orders: formData.get('verbal_orders') === 'on',
			general_notes: formData.get('general_notes'),
			oncall_prefs: formData.get('oncall_prefs'),
		};
		// Ensure data isn't blank
		if (!newPharmacy.name) {
			alert('Required fields cannot be blank.');
			return;
		}
		// Send info to db
		const token = localStorage.getItem('token');
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmacies`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify(newPharmacy),
		});
		const newPharm = await res.json();
		await associateRules(newPharm.id, selectedRules);
		await associateTraining(newPharm.id, selectedTrainings);
		await associateBlurbs(newPharm.id, selectedBlurbs);
		await associateContact(newPharm.id, selectedContacts);
		await onSubmit(e, newPharm);
		resetForm();
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-[5px] flex items-center justify-center z-40">
			<div className="bg-white p-6 rounded-lg shadow-2xl w-150 max-h-[90vh] overflow-y-auto scrollbar-thin">
				<p className="modal-title mb-4">Add New Pharmacy</p>
				<form onSubmit={handleSubmit}>

					{/* Pharmacy Name */}
					<label htmlFor="name" className="block text-sm font-light text-gray-700 mb-1">
						Pharmacy Name <span className="text-red-500">*</span>
					</label>
					<input
						required id="name" name="name" type="text" placeholder="Type here..." autoComplete="off"
						className="w-full mb-3 border border-gray-300 p-2 rounded focus:outline-cyan-500/60"
					/>

					{/* Verbal Orders */}
					<div className="flex items-center mb-1.5">
						<input 
							tabIndex="-1" id="verbal_orders" name="verbal_orders" type="checkbox"
							className="appearance-none custom-chk transition border-1 border-gray-300 w-5 h-5 focus:outline-cyan-500/60 checked:border-0 checked:bg-cyan-800 rounded-full"
						/>
						<label htmlFor="verbal_orders" className="block text-sm p-2 items">Verbal Orders Allowed</label>
					</div>

					{/* General Notes */}
					<RichTextarea
						id="general_notes"
						name="general_notes"
						label="General Notes"
					/>

					{/* Communication Prefs */}
					<RichTextarea
						id="communication"
						name="communication"
						label="Communication Preferences"
					/>

					{/* On-call Prefs */}
					<RichTextarea
						id="oncall_prefs"
						name="oncall_prefs"
						label="On-call Preferences"
					/>
					
					{/* Rules */}
					<ModalRules
						ref={rulesRef}
						selectedRules={selectedRules}
						setSelectedRules={setSelectedRules}
					/>

					{/* Editable by admin only */}
					{hasRole(user, ['admin']) && <>
						{/* VN Instructions (Blurbs) */}
						<ModalBlurbs
							ref={blurbsRef}
							selectedBlurbs={selectedBlurbs}
							setSelectedBlurbs={setSelectedBlurbs}
						/>

						{/* Required Training */}
						<ModalTrainings
							ref={trainingsRef}
							selectedTrainings={selectedTrainings}
							setSelectedTrainings={setSelectedTrainings}
						/>
					</>}

					{/* Pharmacy Contacts */}
					<ModalContacts
						ref={contactsRef}
						selectedContacts={selectedContacts}
						setSelectedContacts={setSelectedContacts}
						contacts={contacts}
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

	// Update pharmacy_rules db based on selected rules
	async function associateRules(pharmId, ruleIds) {
		if (ruleIds.length == 0) return;
		// Send info to db
		const token = localStorage.getItem('token');
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmrules`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify({ pharmacy_id: pharmId, rule_ids: ruleIds }),
		});
	}

	// Update pharmacy_training db based on selected rules
	async function associateTraining(pharmId, trainingIds) {
		if (trainingIds.length == 0) return;
		// Send info to db
		const token = localStorage.getItem('token');
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmtraining`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify({ pharmacy_id: pharmId, training_ids: trainingIds }),
		});
	}

	// Update pharmacy_blurbs db based on selected blurbs
	async function associateBlurbs(pharmId, blurbIds) {
		if (blurbIds.length == 0) return;
		// Send info to db
		const token = localStorage.getItem('token');
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmblurbs`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify({ pharmacy_id: pharmId, blurb_ids: blurbIds }),
		});
	}

	// Update pharmacy_contacts db based on selected contacts
	async function associateContact(pharmId, contactIds) {
		if (contactIds.length == 0) return;
		// Send info to db
		const token = localStorage.getItem('token');
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmcontacts/contacts`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify({ pharmacy_id: pharmId, contact_ids: contactIds }),
		});
	}

	// Check if user has any listed roles
	function hasRole(user, roles = []) {
		return roles.includes(user?.role);
	}
}