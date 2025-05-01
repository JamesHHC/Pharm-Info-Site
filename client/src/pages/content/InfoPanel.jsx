import React, { useEffect, useState } from 'react';

let lastItem = null;

export default function InfoPanel({ selectedItem }) {
	const [rules, setRules] = useState([]);
	const [trainings, setTrainings] = useState([]);
	const [pharmRules, setPharmRules] = useState([]);
	const [pharmTrainings, setPharmTrainings] = useState([]);

	// GET functions
	const fetchRules = async () => {
		fetch('http://localhost:5000/api/rules')
			.then((res) => res.json())
			.then((data) => setRules(data))
			.catch((err) => console.error('Failed to fetch rules', err));
	};
	const fetchTrainings = async () => {
		fetch('http://localhost:5000/api/training')
			.then((res) => res.json())
			.then((data) => setTrainings(data))
			.catch((err) => console.error('Failed to fetch trainings', err));
	};
	const fetchPharmRules = async () => {
		setPharmRules([]);
		fetch(`http://localhost:5000/api/pharmrules?pharmacy_id=${selectedItem.id}`)
			.then((res) => res.json())
			.then((data) => setPharmRules(data))
			.catch((err) => console.error('Failed to fetch pharmacy rules', err));
	};
	const fetchPharmTrainings = async () => {
		setPharmTrainings([]);
		fetch(`http://localhost:5000/api/pharmtraining?pharmacy_id=${selectedItem.id}`)
			.then((res) => res.json())
			.then((data) => setPharmTrainings(data))
			.catch((err) => console.error('Failed to fetch pharmacy trainings', err));
	};

	useEffect(() => {
		if (selectedItem && selectedItem.type === 'pharmacy') {
			fetchRules();
			fetchTrainings();
			fetchPharmRules();
			fetchPharmTrainings();
		}
	}, [selectedItem]);

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
				<div className="bg-gray-200/70 p-3 rounded-xl mt-3 text-xl shadow-sm">
					{selectedItem.general_notes && <div>
						<label className="text-sm">General Notes</label>
						<p className="mb-2 bg-white p-3 rounded-md shadow-sm">{selectedItem.general_notes}</p>
					</div>}
					{selectedItem.communication && <div>
						<label className="text-sm">Communication Preferences</label>
						<p className="mb-2 bg-white p-3 rounded-md shadow-sm">{selectedItem.communication}</p>
					</div>}
					{selectedItem.oncall_prefs && <div>
						<label className="text-sm">On-call Preferences</label>
						<p className="mb-2 bg-white p-3 rounded-md shadow-sm">{selectedItem.oncall_prefs}</p>
					</div>}

					{/* TODO: Rules */}
					{pharmRules.length > 0 && <div>
						<label className="text-sm">Rules</label>
						<div>
							{rules.filter(rule => pharmRules.some(pr => pr.rules_id === rule.id))
								.map(rule => (
									<div
										key={rule.id}
										className="bg-white px-3 py-2 rounded-md shadow-sm border border-gray-300"
									>
										{rule.rule}
									</div>
							))}
						</div>
					</div>}

					{/* TODO: Training */}

					{/* TODO: Contacts */}
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
					<p className="light-small">Contact Info</p>
					<div className="flex">
						<p style={selectedItem.dnc ? {color: 'rgba(200, 80, 80, 1)'} : selectedItem.intake_only ? {color: 'rgba(210, 150, 20, 1)'} : {}} className="title">{selectedItem.name}</p>
						<p className="cursor-pointer edit-icon h-full my-auto ml-2 text-[24px]"></p>
					</div>
					<p>{selectedItem.dnc ? '❌DNC ' : ''}{selectedItem.intake_only ? '⚠️INTAKE ONLY' : ''}</p>
					{selectedItem.contact_type &&
						<div className="text-gray-400 text-sm flex flex-wrap gap-2 mt-1.5">
							{(selectedItem.contact_type).map((type) => (
								<div className="bg-gray-100 outline outline-gray-400 px-2 py-1 rounded-full shadow-sm" key={type}>{type}</div>
							))}
						</div>
					}
					
				</div>
				{/* Contact Detalis/Info */}
				<div className="bg-gray-200/70 p-3 rounded-xl mt-3 text-xl shadow-sm">
					{selectedItem.title && <div>
						<label className="text-sm">Title</label>
						<p className="mb-2 bg-white p-3 rounded-md shadow-sm">{selectedItem.title}</p>
					</div>}
					{selectedItem.email && <div>
						<label className="text-sm">Email</label>
						<p className="mb-2 bg-white p-3 rounded-md shadow-sm">{selectedItem.email}</p>
					</div>}
					{selectedItem.phone && <div>
						<label className="text-sm">Phone Number</label>
						<p className="mb-2 bg-white p-3 rounded-md shadow-sm">{selectedItem.phone}</p>
					</div>}
					{selectedItem.preferences && <div>
						<label className="text-sm">Preferences</label>
						<p className="mb-2 bg-white p-3 rounded-md shadow-sm">{selectedItem.preferences}</p>
					</div>}

					{/* TODO: Pharmacies */}
				</div>
			</>
		);
	}
}