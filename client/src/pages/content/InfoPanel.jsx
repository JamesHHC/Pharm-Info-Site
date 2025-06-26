// React
import React, { useEffect, useState } from 'react';

// Auth
import { useAuth } from '../../auth/AuthContext';
import { hasMinPermission } from '../../auth/checkRole';

// Content
import RichViewer from '../components/RichViewer';

// Assets
import ArchiveFilledIcon from '../../assets/icons/ArchiveFilledIcon';

// Config
import config from '../../config.js';
const serverIp = config.server_ip;
const serverPort = config.server_port;

export default function InfoPanel({ selectedItem, setSelectedItem, editItem }) {
	// User/auth stuff
	const { user } = useAuth();

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
		if (hasMinPermission(user, 'editor')) setContacts(contactJson);
		else setContacts(contactJson.filter((cont) => cont?.active));
	};
	const fetchSomePharmacies = async (idArr) => {
		const res = await fetch(`http://${serverIp}:${serverPort}/api/pharmacies/some`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ids: idArr }),
		});
		const pharmacyJson = await res.json();
		if (hasMinPermission(user, 'editor')) setPharmacies(pharmacyJson);
		else setPharmacies(pharmacyJson.filter((pharm) => pharm?.active));
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
		return (
			<div className="flex flex-col h-full">	
				{/* Header Section */}
				<div className="bg-gray-200/70 p-3 rounded-xl shadow-sm outline outline-gray-300">
					<p>{selectedItem.verbal_orders ? '' : '⚠️NO VERBAL ORDERS'}</p>
					<div className="flex mt-[-6px] mb-[-4px]">
						{/* Archived icon */}
						{selectedItem?.active || <div className="my-auto mr-3 text-red-600"><ArchiveFilledIcon w="26" h="26"/></div>}
						<p className={`${selectedItem?.active || 'line-through'} title mb-1`}>{selectedItem.name}</p>
						{/* Edit button */}
						{hasMinPermission(user, 'editor') && <span onClick={handleEdit} className="cursor-pointer edit-icon h-full my-auto ml-2 text-[24px]"></span>}
					</div>
				</div>
				{/* Pharmacy Details/Info */}
				<div className="flex-1 bg-gray-200/70 px-3 py-2 rounded-xl mt-3 text-xl shadow-sm outline outline-gray-300 overflow-auto scrollbar-thin">
					
					{/* General Notes */}
					<span className="text-sm">General Notes</span>
					<div className="min-h-10 mb-2 bg-white px-3 py-2 rounded-md outline outline-gray-300">
						<RichViewer deltaString={selectedItem.general_notes} styling="off" />
					</div>

					{/* Preferences */}
					<div className="lg:flex space-x-3">
						{/* Communication Preferences */}
						<div className="w-full">
							<span className="text-sm">Communication Preferences</span>
							<div className="min-h-10 mb-2 bg-white px-3 py-2 rounded-md outline outline-gray-300">
								<RichViewer deltaString={selectedItem.communication} styling="off" />
							</div>
						</div>

						{/* On-call Preferences */}
						<div className="w-full">
							<span className="text-sm">On-call Preferences</span>
							<div className="min-h-10 mb-2 bg-white px-3 py-2 rounded-md outline outline-gray-300">
								<RichViewer deltaString={selectedItem.oncall_prefs} styling="off" />
							</div>
						</div>
					</div>
					
					{/* Rules */}
					<span className="text-sm">Rules</span>
					<div className="min-h-10 mb-2 bg-white rounded-md overflow-auto scrollbar-thin outline outline-gray-300">
						{rules.map(rule => (
							<div key={rule.id} className="py-2 px-3 w-full bg-white outline-1 outline-gray-200">
								<RichViewer deltaString={rule.rule} styling="off" />
							</div>
						))}
					</div>

					{/* VN Instructions (Blurbs) */}
					<div className="flex mt-4 mb-[1px]">
						<span className="text-sm">VN Instructions</span>
						<button
							className="text-sm ml-auto cursor-pointer hover:underline opacity-30"
							onClick={() => {
								const descs = document.querySelectorAll('[id^="vdesc_"]');
								const arrws = document.querySelectorAll('[id^="varrow_"]');
								descs.forEach(desc => {desc.hidden = true});
								arrws.forEach(arrw => {arrw.innerHTML = '⮜'});
							}}
						>
							Collapse All
						</button>
					</div>
					<div className="min-h-10 mb-2 bg-white rounded-md overflow-auto scrollbar-thin outline outline-gray-300">
						{blurbs.map(blurb => (
							<div key={blurb.id}>
								<div
									className="cursor-pointer flex py-2 px-3 w-full bg-white outline-1 outline-gray-200"
									onClick={() => {
										const desc = document.getElementById(`vdesc_${blurb.id}`);
										const arrw = document.getElementById(`varrow_${blurb.id}`);
										arrw.innerHTML = desc.hidden ? '⮟' : '⮜'
										desc.hidden = !desc.hidden;
									}}
								>
									<RichViewer deltaString={blurb.name} styling="off" />
									<div id={`varrow_${blurb.id}`} className="ml-auto my-auto text-sm text-gray-400">⮜</div>
								</div>
								<div hidden id={`vdesc_${blurb.id}`} className="py-2 pl-5 pr-3 w-full bg-gray-100 text-sm">
									<RichViewer deltaString={blurb.description} styling="off" />
								</div>
							</div>
						))}
					</div>

					{/* Training Requirements */}
					<div className="flex mt-4 mb-[1px]">
						<span className="text-sm">Training Requirements</span>
						<button
							className="text-sm ml-auto cursor-pointer hover:underline opacity-30"
							onClick={() => {
								const descs = document.querySelectorAll('[id^="tdesc_"]');
								const arrws = document.querySelectorAll('[id^="tarrow_"]');
								descs.forEach(desc => {desc.hidden = true});
								arrws.forEach(arrw => {arrw.innerHTML = '⮜'});
							}}
						>
							Collapse All
						</button>
					</div>
					<div className="min-h-10 mb-2 bg-white rounded-md overflow-auto scrollbar-thin outline outline-gray-300">
						{trainings.map(training => (
							<div key={training.id}>
								<div
									className="cursor-pointer flex py-2 px-3 w-full bg-white outline-1 outline-gray-200"
									onClick={() => {
										const desc = document.getElementById(`tdesc_${training.id}`);
										const arrw = document.getElementById(`tarrow_${training.id}`);
										arrw.innerHTML = desc.hidden ? '⮟' : '⮜'
										desc.hidden = !desc.hidden;
									}}
								>
									<RichViewer deltaString={training.name} styling="off" />
									<div id={`tarrow_${training.id}`} className="ml-auto my-auto text-sm text-gray-400">⮜</div>
								</div>
								<div hidden id={`tdesc_${training.id}`} className="py-2 pl-5 pr-3 w-full bg-gray-100 text-sm">
									<RichViewer deltaString={training.description} styling="off" />
								</div>
							</div>
						))}
					</div>

					{/* Contacts */}
					<span className="text-sm">Contacts</span>
					<div className="flex flex-wrap gap-2 mt-1 mb-2">
						{contacts.length > 0 && contacts.map(contact => (
								<div
									key={contact.id}
									className={`${contact.active || 'opacity-30'} cursor-pointer py-2 px-5 bg-white rounded-full shadow-sm outline outline-gray-300`}
									onClick={() => { setSelectedItem({ ...contact, type: 'contact' }); }}
								>
									<p className="text-base">{contact.name}</p>
									<p className="text-sm font-light">{contact.title}</p>
								</div>
							)
						) || <div className="text-base font-light">No contacts</div>}
					</div>
				</div>
			</div>
		);
	}
	// Contact
	else {
		return (
			<div className="flex flex-col h-full">	
				{/* Header Section */}
				<div className="bg-gray-200/70 p-3 rounded-xl shadow-sm outline outline-gray-300">
					{/* DNC/Intake-only */}
					<p>{selectedItem.dnc ? '❌DNC ' : ''}{selectedItem.intake_only ? '⚠️INTAKE ONLY' : ''}</p>
					{/* Name */}
					<div className="mt-[-6px] flex">
						{/* Archived icon */}
						{selectedItem?.active || <div className="my-auto mr-3 text-red-600"><ArchiveFilledIcon w="26" h="26"/></div>}
						<p
							style={selectedItem.dnc ? {color: 'rgba(200, 80, 80, 1)'} : selectedItem.intake_only ? {color: 'rgba(210, 150, 20, 1)'} : {}}
							className={`${selectedItem?.active || 'line-through'} title mb-1`}
						>
							{selectedItem.name}
						</p>
						{/* Edit button */}
						{hasMinPermission(user, 'editor') && <p onClick={handleEdit} className="cursor-pointer edit-icon h-full my-auto ml-2 text-[24px]"></p>}
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
					<div className="w-min mt-4 min-h-10 min-w-80 bg-white px-3 py-2 rounded-md outline outline-gray-300">
						{selectedItem.email && <div className="inline-flex"><span className="noselect mr-2">🖃</span>{selectedItem.email}</div>}
						<div className="my-1"></div>
						{selectedItem.phone && <div className="inline-flex"><span className="noselect mr-2">🕾</span>{selectedItem.phone}</div>}
					</div>
				</div>

				{/* Details */}
				<div className="flex-1 bg-gray-200/70 px-3 py-2 rounded-xl mt-3 text-xl shadow-sm outline outline-gray-300 overflow-auto scrollbar-thin">
					{/* Preferences */}
					<span className="text-sm">Preferences</span>
					<div className="min-h-10 mb-2 bg-white px-3 py-2 rounded-md outline outline-gray-300">
						<RichViewer deltaString={selectedItem.preferences} styling="off" />
					</div>
					
					{/* Pharmacies */}
					<span className="text-sm">Pharmacies</span>
					<div className="flex flex-wrap gap-2 mt-1 mb-2">
						{pharmacies.length > 0 && pharmacies.map(pharmacy => (
								<div
									key={pharmacy.id}
									className={`${pharmacy.active || 'opacity-30'} cursor-pointer text-base py-2 px-4 bg-white rounded-full shadow-sm outline outline-gray-300`}
									onClick={() => { setSelectedItem({ ...pharmacy, type: 'pharmacy' }); }}
								>
									<p>{pharmacy.name}</p>
								</div>
							)
						) || <div className="text-base font-light">No pharmacies</div>}
					</div>
				</div>
			</div>
		);
	}
}