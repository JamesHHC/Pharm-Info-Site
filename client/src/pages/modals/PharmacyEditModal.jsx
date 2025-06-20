// React
import React, { useEffect, useState, useRef } from 'react';

// Content
import ModalRules from './modal-content/ModalRules';
import ModalTrainings from './modal-content/ModalTrainings';
import ModalBlurbs from './modal-content/ModalBlurbs';
import ModalContacts from './modal-content/ModalContacts';
import TrashIcon from '../../assets/icons/TrashIcon';
import RichTextarea from '../components/RichTextarea';

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
	const [selectedBlurbs, setSelectedBlurbs] = useState([]);
	const [selectedContacts, setSelectedContacts] = useState([]);

	// RichText references
	const commRef = useRef();
	const noteRef = useRef();
	const callRef = useRef();

	// Set form values based on existing ones
	useEffect(() => {
		// TODO (low-priority): Auto-resize textareas for better UX once production-ready
		const initValues = async () => {
			setPharmName(openPharmacy.name);
			setPharmVerb(openPharmacy?.verbal_orders || false);

			// General Notes
			setPharmNote(openPharmacy?.general_notes || '');
			noteRef.current?.setVal(openPharmacy?.general_notes || '');
			// Communication Prefs
			setPharmComm(openPharmacy?.communication || '');
			commRef.current?.setVal(openPharmacy?.communication || '');
			// On-call Prefs
			setPharmCall(openPharmacy?.oncall_prefs || '');
			callRef.current?.setVal(openPharmacy?.oncall_prefs || '');

			setSelectedRules(await getPharmRules(openPharmacy.id));
			setSelectedTrainings(await getPharmTrainings(openPharmacy.id));
			setSelectedBlurbs(await getPharmBlurbs(openPharmacy.id));
			setSelectedContacts(await getPharmContacts(openPharmacy.id));
		}
		if (isOpen) initValues();
	}, [isOpen]);

	// References
	const rulesRef = useRef();
	const trainingsRef = useRef();
	const blurbsRef = useRef();
	const contactsRef = useRef();

	// Reset fields w/in form
	const resetForm = () => {
		commRef.current?.clear();
		noteRef.current?.clear();
		callRef.current?.clear();

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
		const updatedPharmacy = {
			id: openPharmacy.id,
			name: pharmName.trim(),
			communication: pharmComm,
			verbal_orders: pharmVerb,
			general_notes: pharmNote,
			oncall_prefs: pharmCall,
		};
		// Ensure data isn't blank
		if (!updatedPharmacy.name) {
			alert('Required fields cannot be blank.');
			return;
		}
		// Send info to db
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmacies`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updatedPharmacy),
		});
		const updatedPharm = await res.json();
		await associateRules(updatedPharm.id, selectedRules);
		await associateTraining(updatedPharm.id, selectedTrainings);
		await associateBlurbs(updatedPharm.id, selectedBlurbs);
		await associateContact(updatedPharm.id, selectedContacts);
		await onSubmit(e, updatedPharm);
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

					{/* General Notes */}
					<RichTextarea 
						id="general_notes"
						name="general_notes"
						label="General Notes"
						ref={noteRef}
						onChange={(e) => setPharmNote(e)}
					/>

					{/* Communication Prefs */}
					<RichTextarea 
						id="communication"
						name="communication"
						label="Communication Preferences"
						ref={commRef}
						onChange={(e) => setPharmComm(e)}
					/>

					{/* On-call Prefs */}
					<RichTextarea 
						id="oncall_prefs"
						name="oncall_prefs"
						label="On-call Preferences"
						ref={callRef}
						onChange={(e) => setPharmCall(e)}
					/>
					
					{/* Rules */}
					<ModalRules
						ref={rulesRef}
						selectedRules={selectedRules}
						setSelectedRules={setSelectedRules}
					/>

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
		// Send info to db
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmrules`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ pharmacy_id: pharmId, rule_ids: ruleIds }),
		});
	}

	// Update pharmacy_training db based on selected rules
	async function associateTraining(pharmId, trainingIds) {
		// Send info to db
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmtraining`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ pharmacy_id: pharmId, training_ids: trainingIds }),
		});
	}

	// Update pharmacy_blurbs db based on selected blurbs
	async function associateBlurbs(pharmId, blurbIds) {
		// Send info to db
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmblurbs`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ pharmacy_id: pharmId, blurb_ids: blurbIds }),
		});
	}

	// Update pharmacy_contacts db based on selected contacts
	async function associateContact(pharmId, contactIds) {
		// Send info to db
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmcontacts/contacts`, {
			method: 'PATCH',
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

	// Return IDs of blurbs for given pharmacy ID
	async function getPharmBlurbs(id) {
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmblurbs?pharmacy_id=${id}`);
		const data = await res.json();
		return data.map(b => b.blurb_id);
	}

	// Return IDs of contacts for given pharmacy ID
	async function getPharmContacts(id) {
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmcontacts/contacts?pharmacy_id=${id}`);
		const data = await res.json();
		return data.map(c => c.contact_id);
	}
}