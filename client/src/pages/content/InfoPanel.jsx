import React, { useEffect, useState } from 'react';

let lastItem = null;

export default function InfoPanel({ selectedItem }) {
	// For rules & trainings
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

	// Run whenever selectedItem changes
	useEffect(() => {
		if (selectedItem && selectedItem.type === 'pharmacy') {
			fetchRules();
			fetchTrainings();
			fetchPharmRules();
			fetchPharmTrainings();
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
								{rules.filter(rule => pharmRules.some(pr => pr.rules_id === rule.id))
									.map(rule => (
										<div key={rule.id} className="py-2 px-3 w-full bg-white outline-1 outline-gray-200">
											{rule.rule}
										</div>
									)
								)}
							</div>
						</div>
						{/* Training Requirements */}
						<div className="w-full">
							<label className="text-sm">Training Requirements</label>
							<div className="min-h-11 mb-2 bg-white rounded-md shadow-sm overflow-auto scrollbar-thin">
								{trainings.filter(training => pharmTrainings.some(pt => pt.training_id === training.id))
									.map(training => (
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
									)
								)}
							</div>
						</div>
					</div>
					{/* TODO: Contacts */}
					<label className="text-sm">Contacts</label>
					<div className="min-h-11 mb-2 bg-white rounded-md shadow-sm p-2"></div>
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

					{/* TODO: Pharmacies */}
					<label className="text-sm">Pharmacies</label>
					<div className="min-h-11 mb-2 bg-white rounded-md shadow-sm p-2"></div>
				</div>
			</>
		);
	}
}