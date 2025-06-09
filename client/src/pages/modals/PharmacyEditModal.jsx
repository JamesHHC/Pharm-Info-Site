// React
import React, { useEffect, useState, useRef } from 'react';

// Content
import ModalRules from './modal-content/ModalRules';
import ModalTrainings from './modal-content/ModalTrainings';
import ModalContacts from './modal-content/ModalContacts';
import TrashIcon from '../../assets/icons/TrashIcon';

// Styles
import './ModalStyles.css'

// Config
import config from '../../config.js';
const serverIp = config.server_ip;
const serverPort = config.server_port;

export default function PharmacyFormModal({ isOpen, onClose, onSubmit, contacts, openPharmacy, setSelectedItem }) {
	// For tracking form values
	const [pharmName, setPharmName] = useState('');
	const [pharmVerb, setPharmVerb] = useState(false);
	const [pharmComm, setPharmComm] = useState('');
	const [pharmNote, setPharmNote] = useState('');
	const [pharmCall, setPharmCall] = useState('');
	// For tracking selected options
	const [selectedRules, setSelectedRules] = useState([]);
	const [selectedTrainings, setSelectedTrainings] = useState([]);
	const [selectedContacts, setSelectedContacts] = useState([]);

	// Set form values based on existing ones
	useEffect(() => {
		// TODO (low-priority): Auto-resize textareas for better UX once production-ready
		const initValues = async () => {
			setPharmName(openPharmacy.name);
			setPharmVerb(openPharmacy?.verbal_orders || false);
			setPharmComm(openPharmacy?.communication || '');
			setPharmNote(openPharmacy?.general_notes || '');
			setPharmCall(openPharmacy?.oncall_prefs || '');
			setSelectedRules(await getPharmRules(openPharmacy.id));
			setSelectedTrainings(await getPharmTrainings(openPharmacy.id));
			if (contacts.length > 0) setSelectedContacts(await getPharmContacts(openPharmacy.id));
			else setSelectedContacts([]);
		}
		if (isOpen) initValues();
	}, [isOpen]);

	// References
	const rulesRef = useRef();
	const trainingsRef = useRef();
	const contactsRef = useRef();

	// Reset fields w/in form
	const resetForm = () => {
		rulesRef.current?.resetRulesForm();
		trainingsRef.current?.resetTrainingsForm();
		contactsRef.current?.resetContactsForm();
	};

	// Run when form submitted
	const handleSubmit = async (e) => {
		e.preventDefault();
		return alert('TODO: Update function'); // TODO
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
		await onSubmit(e, newPharm);
		resetForm();
		onClose();
	};

	// Delete the pharmacy currently being edited
	const deletePharmacy = async () => {
		const id = openPharmacy.id;
		const conf = confirm(`Are you sure you want to delete this pharmacy?\n\n${openPharmacy.name}`);
		if (conf) {
			// Call db to delete data
			await fetch(`http://${serverIp}:${serverPort}/api/pharmacies?id=${id}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
			});
			setSelectedItem(null);
			resetForm();
			onClose();
		}
	};

	if (!isOpen || openPharmacy.type !== 'pharmacy') return null;

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-[5px] flex items-center justify-center z-40">
			<div className="bg-white outline-3 outline-amber-500/60 p-6 rounded-lg shadow-2xl w-150 max-h-[90vh] overflow-y-auto scrollbar-thin">
				<p className="text-3xl font-bold mb-4 text-orange-900/70">Edit Pharmacy</p>
				<form onSubmit={handleSubmit}>

					{/* Pharmacy Name */}
					<label htmlFor="name" className="block text-sm font-light text-gray-700 mb-1">
						Pharmacy Name <span className="text-red-500">*</span>
					</label>
					<input
						value={pharmName} onChange={(e) => setPharmName(e.target.value)}
						required id="name" name="name" type="text" placeholder="Type here..." autoComplete="off"
						className="w-full mb-3 border border-gray-300 p-2 rounded focus:outline-cyan-500/60"
					/>

					{/* Verbal Orders */}
					<div className="flex items-center mb-1.5">
						<input
							checked={pharmVerb} onChange={(e) => setPharmVerb(e.target.checked)}
							tabIndex="-1" id="verbal_orders" name="verbal_orders" type="checkbox"
							className="appearance-none custom-chk transition border-1 border-gray-300 w-5 h-5 focus:outline-cyan-500/60 checked:border-0 checked:bg-cyan-800 rounded-full"
						/>
						<label htmlFor="verbal_orders" className="block text-sm p-2 items">Verbal Orders Allowed</label>
					</div>

					{/* Communication Prefs */}
					<label htmlFor="communication" className="block text-sm font-light text-gray-700 mb-1">Communication Preferences</label>
					<textarea
						value={pharmComm} onChange={(e) => setPharmComm(e.target.value)}
						id="communication" name="communication" placeholder="Type here..."
						className="w-full mb-1.5 border border-gray-300 p-2 rounded focus:outline-cyan-500/60 scrollbar-thin"
					/>

					{/* General Notes */}
					<label htmlFor="general_notes" className="block text-sm font-light text-gray-700 mb-1">General Notes</label>
					<textarea
						value={pharmNote} onChange={(e) => setPharmNote(e.target.value)}
						id="general_notes" name="general_notes" placeholder="Type here..."
						className="w-full mb-1.5 border border-gray-300 p-2 rounded focus:outline-cyan-500/60 scrollbar-thin"
					/>

					{/* On-call Prefs */}
					<label htmlFor="oncall_prefs" className="block text-sm font-light text-gray-700 mb-1">On-call Preferences</label>
					<textarea
						value={pharmCall} onChange={(e) => setPharmCall(e.target.value)}
						id="oncall_prefs" name="oncall_prefs" placeholder="Type here..."
						className="w-full mb-1.5 border border-gray-300 p-2 rounded focus:outline-cyan-500/60 scrollbar-thin"
					/>
					
					{/* Rules */}
					<ModalRules
						ref={rulesRef}
						selectedRules={selectedRules}
						setSelectedRules={setSelectedRules}
					/>

					{/* Required Training */}
					<ModalTrainings
						ref={trainingsRef}
						selectedTrainings={selectedTrainings}
						setSelectedTrainings={setSelectedTrainings}
					/>

					{/* Pharmacy Contacts */}
					<ModalContacts
						ref={contactsRef}
						selectedContacts={selectedContacts}
						setSelectedContacts={setSelectedContacts}
						contacts={contacts}
					/>

					{/* Cancel/Submit Buttons */}
					<div className="flex justify-end">
						<button tabIndex="-1" type="button" onClick={deletePharmacy} className="cursor-pointer mr-auto px-4 py-2 bg-red-800/20 text-red-900 hover:bg-red-800/30 rounded-md">
							<TrashIcon className="my-auto"/>
						</button>
						<button type="button" onClick={() => {onClose(); resetForm();}} className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-400 hover:bg-gray-300 rounded-l-md focus:outline-amber-500/60">Cancel</button>
						<button type="submit" className="cursor-pointer px-4 py-2 bg-orange-600/60 hover:bg-orange-600/80 text-white rounded-r-md focus:outline-amber-500/60">Save</button>
					</div>

				</form>
			</div>
		</div>
	);

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

	// Return IDs of rules for given pharmacy ID
	async function getPharmRules(id) {
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmrules?pharmacy_id=${id}`);
		const data = await res.json();
		return data.map(r => r.rules_id);
	}

	// Return IDs of trainings for given pharmacy ID
	async function getPharmTrainings(id) {
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmtraining?pharmacy_id=${id}`);
		const data = await res.json();
		return data.map(t => t.training_id);
	}

	// Return IDs of contacts for given pharmacy ID
	async function getPharmContacts(id) {
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmcontacts/contacts?pharmacy_id=${id}`);
		const data = await res.json();
		return data.map(c => c.contact_id);
	}
}