import React, { useEffect, useState } from 'react';
import config from '../../config.js';

const serverIp = config.server_ip;
const serverPort = config.server_port;

export default function InfoPanel({ selectedItem, setSelectedItem }) {
	// For rules & trainings
	const [rules, setRules] = useState([]);
	const [trainings, setTrainings] = useState([]);
	const [pharmRules, setPharmRules] = useState([]);
	const [pharmTrainings, setPharmTrainings] = useState([]);

	//For contacts
	const [contacts, setContacts] = useState([]);
	const [pharmContacts, setPharmContacts] = useState([]);

	//For pharmacies
	const [pharmacies, setPharmacies] = useState([]);
	const [contPharmacies, setContPharmacies] = useState([]);

	// GET functions
	const fetchPharmRules = async () => {
		setPharmRules([]);
		setRules([]);
		try {
			const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmrules?pharmacy_id=${selectedItem.id}`);
			const data = await res.json();
			setPharmRules(data);
			// Get rules corresponding to selectedItem id
			if (data.length > 0) fetchSomeRules(data.map(pr => pr.rules_id));
		}
		catch (err) {
			console.error('Failed to fetch pharmacy rules', err);
		}
	};
	const fetchPharmTrainings = async () => {
		setPharmTrainings([]);
		setTrainings([]);
		try {
			const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmtraining?pharmacy_id=${selectedItem.id}`);
			const data = await res.json();
			setPharmTrainings(data);
			// Get trainings corresponding to selectedItem id
			if (data.length > 0) fetchSomeTrainings(data.map(pt => pt.training_id));
		}
		catch (err) {
			console.error('Failed to fetch pharmacy trainings', err);
		}
	};
	const fetchPharmContacts = async () => {
		setPharmContacts([]);
		setContacts([]);
		try {
			const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmcontacts/contacts?pharmacy_id=${selectedItem.id}`);
			const data = await res.json();
			setPharmContacts(data);
			if (data.length > 0) fetchSomeContacts(data.map(pc => pc.contact_id));
		}
		catch (err) {
			console.error('Failed to fetch pharmacy contacts', err);
		}
	};
	const fetchContactPharms = async () => {
		setContPharmacies([]);
		setPharmacies([]);
		try {
			const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmcontacts/pharmacies?contact_id=${selectedItem.id}`);
			const data = await res.json();
			setContPharmacies(data);
			if (data.length > 0) fetchSomePharmacies(data.map(cph => cph.pharmacy_id));
		}
		catch (err) {
			console.error('Failed to fetch contact pharmacies', err);
		}
	};

	// POST functions
	const fetchSomeRules = async (idArr) => {
		const res = await fetch(`http://${serverIp}:${serverPort}/api/rules/some`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ids: idArr }),
		});
		const ruleJson = await res.json();
		setRules(ruleJson);
	};
	const fetchSomeTrainings = async (idArr) => {
		const res = await fetch(`http://${serverIp}:${serverPort}/api/training/some`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ids: idArr }),
		});
		const trainingJson = await res.json();
		setTrainings(trainingJson);
	};
	const fetchSomeContacts = async (idArr) => {
		const res = await fetch(`http://${serverIp}:${serverPort}/api/contacts/some`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ids: idArr }),
		});
		const contactJson = await res.json();
		setContacts(contactJson);
	};
	const fetchSomePharmacies = async (idArr) => {
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmacies/some`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ids: idArr }),
		});
		const pharmacyJson = await res.json();
		setPharmacies(pharmacyJson);
	};

	// Run whenever selectedItem changes
	useEffect(() => {
		// Pharmacy
		if (selectedItem && selectedItem.type === 'pharmacy') {
			fetchPharmRules();
			fetchPharmTrainings();
			fetchPharmContacts();
		}
		// Contact
		else if (selectedItem && selectedItem.type === 'contact') {
			fetchContactPharms();
		}
	}, [selectedItem]);

	// No item selected
	if (!selectedItem) return <div className="flex h-full"><p className="light-large m-auto">Select a pharmacy or contact to view its details.</p></div>;

	// Pharmacy
	if (selectedItem.type === 'pharmacy') {
		return (
			<>
				{/* Header Section */}
				<div className="bg-gray-200/70 p-3 rounded-xl shadow-sm">
					<p className="light-small">Pharmacy Info</p>
					<div className="flex">
						<p className="title">{selectedItem.name}</p>
						<span className="cursor-pointer edit-icon h-full my-auto ml-2 text-[24px]"></span>
					</div>
					<p>{selectedItem.verbal_orders ? '' : '⚠️NO VERBAL ORDERS'}</p>
				</div>
				{/* Pharmacy Details/Info */}
				<div className="bg-gray-200/70 px-3 py-2 rounded-xl mt-3 text-xl shadow-sm">
					
					{/* General Notes */}
					<label className="text-sm">General Notes</label>
					<p className="min-h-11 mb-2 bg-white px-3 py-2 rounded-md shadow-sm">{selectedItem.general_notes}</p>

					{/* Communication Preferences */}
					<label className="text-sm">Communication Preferences</label>
					<p className="min-h-11 mb-2 bg-white px-3 py-2 rounded-md shadow-sm">{selectedItem.communication}</p>

					{/* On-call Preferences */}
					<label className="text-sm">On-call Preferences</label>
					<p className="min-h-11 mb-2 bg-white px-3 py-2 rounded-md shadow-sm">{selectedItem.oncall_prefs}</p>

					{/* Rules & Training */}
					<div className="flex space-x-3">
						{/* Rules */}
						<div className="w-full">
							<label className="text-sm">Rules</label>
							<div className="min-h-11 mb-2 bg-white rounded-md shadow-sm overflow-auto scrollbar-thin">
								{rules.map(rule => (
									<div key={rule.id} className="py-2 px-3 w-full bg-white outline-1 outline-gray-200">
										{rule.rule}
									</div>
								))}
							</div>
						</div>
						{/* Training Requirements */}
						<div className="w-full">
							<label className="text-sm">Training Requirements</label>
							<div className="min-h-11 mb-2 bg-white rounded-md shadow-sm overflow-auto scrollbar-thin">
								{trainings.map(training => (
									<div key={training.id}>
										<div
											className="flex py-2 px-3 w-full bg-white outline-1 outline-gray-200"
											onClick={() => {
												const desc = document.getElementById(`desc_${training.id}`);
												const arrw = document.getElementById(`arrow_${training.id}`);
												arrw.innerHTML = desc.hidden ? '⮟' : '⮜'
												desc.hidden = !desc.hidden;
											}}
										>
											<div>{training.name}</div>
											<div id={`arrow_${training.id}`} className="ml-auto text-gray-400">⮜</div>
										</div>
										<div hidden id={`desc_${training.id}`} className="py-2 pl-5 pr-3 w-full bg-gray-100 text-sm">
											{training.description}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Contacts */}
					<label className="text-sm">Contacts</label>
					<div className="flex flex-wrap gap-2 mt-1">
						{contacts.map(contact => (
								<div
									key={contact.id}
									className="cursor-pointer py-2 px-4 bg-white rounded-full shadow-sm"
									onClick={() => { setSelectedItem({ ...contact, type: 'contact' }); }}
								>
									<div>{contact.name}</div>
								</div>
							)
						)}
					</div>
				</div>
			</>
		);
	}
	// Contact
	else {
		return (
			<>	
				{/* Header Section */}
				<div className="bg-gray-200/70 p-3 rounded-xl shadow-sm">
					{/* DNC/Intake-only */}
					<p>{selectedItem.dnc ? '❌DNC ' : ''}{selectedItem.intake_only ? '⚠️INTAKE ONLY' : ''}</p>
					{/* Name */}
					<div className="mt-[-6px] flex">
						<p style={selectedItem.dnc ? {color: 'rgba(200, 80, 80, 1)'} : selectedItem.intake_only ? {color: 'rgba(210, 150, 20, 1)'} : {}} className="title">
							{selectedItem.name}
						</p>
						<p className="cursor-pointer edit-icon h-full my-auto ml-2 text-[24px]"></p>
					</div>
					{/* Title */}
					<p className="mt-[-8px] mb-[-4px] text-lg font-light">{selectedItem.title}</p>
					{/* Contact Type(s) */}
					{selectedItem.contact_type.length > 0 &&
						<div className="text-gray-400 text-sm flex flex-wrap gap-2 mt-3">
							{(selectedItem.contact_type).map((type) => (
								<div className="bg-gray-100 outline outline-gray-400 px-2 py-1 rounded-full shadow-sm" key={type}>{type}</div>
							))}
						</div>
					}
					{/* Email/Phone */}
					<div className="w-min mt-4 min-h-11 min-w-80 bg-white px-3 py-2 rounded-md shadow-sm">
						{selectedItem.email && <div className="inline-flex"><span className="noselect mr-2">🖃</span>{selectedItem.email}</div>}
						<div className="my-1"></div>
						{selectedItem.phone && <div className="inline-flex"><span className="noselect mr-2">🕾</span>{selectedItem.phone}</div>}
					</div>
				</div>
				{/* Details */}
				<div className="bg-gray-200/70 px-3 py-2 rounded-xl mt-3 text-xl shadow-sm">

					{/* Preferences */}
					<label className="text-sm">Preferences</label>
					<p className="min-h-11 mb-2 bg-white px-3 py-2 rounded-md shadow-sm">{selectedItem.preferences}</p>

					{/* Pharmacies */}
					<label className="text-sm">Pharmacies</label>
					<div className="flex flex-wrap gap-2 mt-1">
						{pharmacies.map(pharmacy => (
								<div
									key={pharmacy.id}
									className="cursor-pointer py-2 px-4 bg-white rounded-full shadow-sm"
									onClick={() => { setSelectedItem({ ...pharmacy, type: 'pharmacy' }); }}
								>
									<div>{pharmacy.name}</div>
								</div>
							)
						)}
					</div>
				</div>
			</>
		);
	}
}