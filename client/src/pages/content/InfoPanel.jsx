// React
import React, { useEffect, useState } from 'react';

// Content
import RichViewer from '../components/RichViewer';

// Config
import config from '../../config.js';
const serverIp = config.server_ip;
const serverPort = config.server_port;

export default function InfoPanel({ selectedItem, setSelectedItem, editItem }) {
	const [rules, setRules] = useState([]);
	const [trainings, setTrainings] = useState([]);
	const [blurbs, setBlurbs] = useState([]);
	const [contacts, setContacts] = useState([]);
	const [pharmacies, setPharmacies] = useState([]);

	// GET functions
	const fetchPharmRules = async () => {
		setRules([]);
		try {
			const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmrules?pharmacy_id=${selectedItem.id}`);
			const data = await res.json();
			// Get rules corresponding to selectedItem id
			if (data.length > 0) fetchSomeRules(data.map(pr => pr.rules_id));
		}
		catch (err) {
			console.error('Failed to fetch pharmacy rules', err);
		}
	};
	const fetchPharmTrainings = async () => {
		setTrainings([]);
		try {
			const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmtraining?pharmacy_id=${selectedItem.id}`);
			const data = await res.json();
			// Get trainings corresponding to selectedItem id
			if (data.length > 0) fetchSomeTrainings(data.map(pt => pt.training_id));
		}
		catch (err) {
			console.error('Failed to fetch pharmacy trainings', err);
		}
	};
	const fetchPharmBlurbs = async () => {
		setBlurbs([]);
		try {
			const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmblurbs?pharmacy_id=${selectedItem.id}`);
			const data = await res.json();
			// Get blurbs corresponding to selectedItem id
			if (data.length > 0) fetchSomeBlurbs(data.map(pb => pb.blurb_id));
		}
		catch (err) {
			console.error('Failed to fetch pharmacy blurbs', err);
		}
	};
	const fetchPharmContacts = async () => {
		setContacts([]);
		try {
			const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmcontacts/contacts?pharmacy_id=${selectedItem.id}`);
			const data = await res.json();
			if (data.length > 0) fetchSomeContacts(data.map(pc => pc.contact_id));
		}
		catch (err) {
			console.error('Failed to fetch pharmacy contacts', err);
		}
	};
	const fetchContactPharms = async () => {
		setPharmacies([]);
		try {
			const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmcontacts/pharmacies?contact_id=${selectedItem.id}`);
			const data = await res.json();
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
	const fetchSomeBlurbs = async (idArr) => {
		const res = await fetch(`http://${serverIp}:${serverPort}/api/blurbs/some`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ids: idArr }),
		});
		const blurbJson = await res.json();
		setBlurbs(blurbJson);
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
			fetchPharmBlurbs();
			fetchPharmContacts();
		}
		// Contact
		else if (selectedItem && selectedItem.type === 'contact') {
			fetchContactPharms();
		}
	}, [selectedItem]);

	// Handle edits to this item
	const handleEdit = async () => {
		await editItem();
	};

	// No item selected
	if (!selectedItem) return <div className="flex h-full"><p className="light-large m-auto text-center">Select a pharmacy or contact to view its details.</p></div>;

	// Pharmacy
	if (selectedItem.type === 'pharmacy') {
		return (<>
			{/* Header Section */}
			<div className="bg-gray-200/70 p-3 rounded-xl shadow-sm">
				<p>{selectedItem.verbal_orders ? '' : '⚠️NO VERBAL ORDERS'}</p>
				<div className="flex mt-[-6px] mb-[-4px]">
					<p className="title">{selectedItem.name}</p>
					{/* Edit button */}
					<span onClick={handleEdit} className="cursor-pointer edit-icon h-full my-auto ml-2 text-[24px]"></span>
				</div>
			</div>
			{/* Pharmacy Details/Info */}
			<div className="bg-gray-200/70 px-3 py-2 rounded-xl mt-3 text-xl shadow-sm">
				
				{/* General Notes */}
				<label className="text-sm">General Notes</label>
				<div className="min-h-10 mb-2 bg-white px-3 py-2 rounded-md shadow-sm">
					<RichViewer deltaString={selectedItem.general_notes} styling="off" />
				</div>

				{/* Preferences */}
				<div className="lg:flex space-x-3">
					{/* Communication Preferences */}
					<div className="w-full">
						<label className="text-sm">Communication Preferences</label>
						<div className="min-h-10 mb-2 bg-white px-3 py-2 rounded-md shadow-sm">
							<RichViewer deltaString={selectedItem.communication} styling="off" />
						</div>
					</div>

					{/* On-call Preferences */}
					<div className="w-full">
						<label className="text-sm">On-call Preferences</label>
						<div className="min-h-10 mb-2 bg-white px-3 py-2 rounded-md shadow-sm">
							<RichViewer deltaString={selectedItem.oncall_prefs} styling="off" />
						</div>
					</div>
				</div>
				
				{/* Rules */}
				<label className="text-sm">Rules</label>
				<div className="min-h-10 mb-2 bg-white rounded-md shadow-sm overflow-auto scrollbar-thin">
					{rules.map(rule => (
						<div key={rule.id} className="py-2 px-3 w-full bg-white outline-1 outline-gray-200">
							<RichViewer deltaString={rule.rule} styling="off" />
						</div>
					))}
				</div>

				{/* VN Instructions (Blurbs) */}
				<label className="text-sm">VN Instructions</label>
				<div className="min-h-10 mb-2 bg-white rounded-md shadow-sm overflow-auto scrollbar-thin">
					{blurbs.map(blurb => (
						<div key={blurb.id}>
							<div
								className="cursor-pointer flex py-2 px-3 w-full bg-white outline-1 outline-gray-200"
								onClick={() => {
									const desc = document.getElementById(`desc_${blurb.id}`);
									const arrw = document.getElementById(`arrow_${blurb.id}`);
									arrw.innerHTML = desc.hidden ? '⮟' : '⮜'
									desc.hidden = !desc.hidden;
								}}
							>
								<RichViewer deltaString={blurb.name} styling="off" />
								<div id={`arrow_${blurb.id}`} className="ml-auto my-auto text-sm text-gray-400">⮜</div>
							</div>
							<div hidden id={`desc_${blurb.id}`} className="py-2 pl-5 pr-3 w-full bg-gray-100 text-sm">
								<RichViewer deltaString={blurb.description} styling="off" />
							</div>
						</div>
					))}
				</div>

				{/* Training Requirements */}
				<label className="text-sm">Training Requirements</label>
				<div className="min-h-10 mb-2 bg-white rounded-md shadow-sm overflow-auto scrollbar-thin">
					{trainings.map(training => (
						<div key={training.id}>
							<div
								className="cursor-pointer flex py-2 px-3 w-full bg-white outline-1 outline-gray-200"
								onClick={() => {
									const desc = document.getElementById(`desc_${training.id}`);
									const arrw = document.getElementById(`arrow_${training.id}`);
									arrw.innerHTML = desc.hidden ? '⮟' : '⮜'
									desc.hidden = !desc.hidden;
								}}
							>
								<RichViewer deltaString={training.name} styling="off" />
								<div id={`arrow_${training.id}`} className="ml-auto my-auto text-sm text-gray-400">⮜</div>
							</div>
							<div hidden id={`desc_${training.id}`} className="py-2 pl-5 pr-3 w-full bg-gray-100 text-sm">
								<RichViewer deltaString={training.description} styling="off" />
							</div>
						</div>
					))}
				</div>

				{/* Contacts */}
				<label className="text-sm">Contacts</label>
				<div className="flex flex-wrap gap-2 mt-1 mb-2">
					{contacts.length > 0 && contacts.map(contact => (
							<div
								key={contact.id}
								className="cursor-pointer py-2 px-5 bg-white rounded-full shadow-sm"
								onClick={() => { setSelectedItem({ ...contact, type: 'contact' }); }}
							>
								<p className="text-base">{contact.name}</p>
								<p className="text-sm font-light">{contact.title}</p>
							</div>
						)
					) || <div className="text-base font-light">No contacts</div>}
				</div>
			</div>
		</>);
	}
	// Contact
	else {
		return (<>	
			{/* Header Section */}
			<div className="bg-gray-200/70 p-3 rounded-xl shadow-sm">
				{/* DNC/Intake-only */}
				<p>{selectedItem.dnc ? '❌DNC ' : ''}{selectedItem.intake_only ? '⚠️INTAKE ONLY' : ''}</p>
				{/* Name */}
				<div className="mt-[-6px] flex">
					<p style={selectedItem.dnc ? {color: 'rgba(200, 80, 80, 1)'} : selectedItem.intake_only ? {color: 'rgba(210, 150, 20, 1)'} : {}} className="title">
						{selectedItem.name}
					</p>
					{/* Edit button */}
					<p onClick={handleEdit} className="cursor-pointer edit-icon h-full my-auto ml-2 text-[24px]"></p>
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
				<div className="w-min mt-4 min-h-10 min-w-80 bg-white px-3 py-2 rounded-md shadow-sm">
					{selectedItem.email && <div className="inline-flex"><span className="noselect mr-2">🖃</span>{selectedItem.email}</div>}
					<div className="my-1"></div>
					{selectedItem.phone && <div className="inline-flex"><span className="noselect mr-2">🕾</span>{selectedItem.phone}</div>}
				</div>
			</div>

			{/* Details */}
			<div className="bg-gray-200/70 px-3 py-2 rounded-xl mt-3 text-xl shadow-sm">
				{/* Preferences */}
				<label className="text-sm">Preferences</label>
				<div className="min-h-10 mb-2 bg-white px-3 py-2 rounded-md shadow-sm">
					<RichViewer deltaString={selectedItem.preferences} styling="off" />
				</div>
				
				{/* Pharmacies */}
				<label className="text-sm">Pharmacies</label>
				<div className="flex flex-wrap gap-2 mt-1 mb-2">
					{pharmacies.map(pharmacy => (
							<div
								key={pharmacy.id}
								className="cursor-pointer text-base py-2 px-4 bg-white rounded-full shadow-sm"
								onClick={() => { setSelectedItem({ ...pharmacy, type: 'pharmacy' }); }}
							>
								<p>{pharmacy.name}</p>
							</div>
						)
					)}
				</div>
			</div>
		</>);
	}
}