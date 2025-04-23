import React from 'react';

let lastItem = null;

export default function InfoPanel({selectedItem}) {
	if (!selectedItem) return <div className="flex h-full"><h4 className="m-auto">Select a pharmacy or contact to view its details.</h4></div>;

	// Pharmacy
	if (selectedItem?.verbal_orders !== undefined) {
		return (
			<>
				{/* Title/Name */}
				<div className="bg-gray-200/70 p-3 rounded-xl">
					<h5>Pharmacy Info</h5>
					<p className="title">{selectedItem.name}</p>
					<p>{selectedItem.verbal_orders ? '' : '⚠️ NO VERBAL ORDERS'}</p>
				</div>
				{/* Pharmacy Details/Info */}
				<div className="bg-gray-200/70 p-3 rounded-xl mt-3 text-xl">
					{selectedItem.general_notes && <div>
						<label className="text-sm">General Notes</label>
						<p className="mb-2">{selectedItem.general_notes}</p>
					</div>}
					{selectedItem.communication && <div>
						<label className="text-sm">Communication Preferences</label>
						<p className="mb-2">{selectedItem.communication}</p>
					</div>}
					{selectedItem.oncall_prefs && <div>
						<label className="text-sm">On-call Preferences</label>
						<p className="mb-2">{selectedItem.oncall_prefs}</p>
					</div>}

					{/* TODO: Rules, Training, Contacts */}
				</div>
			</>
		);
	}
	// Contact
	else {
		return (
			<>
				{/* Title/Name */}
				<div className="bg-gray-200/70 p-3 rounded-xl">
					<h5>Contact Info</h5>
					<p style={selectedItem.dnc ? {color: 'rgba(200, 80, 80, 1)'} : selectedItem.intake_only ? 
						{color: 'rgba(210, 150, 20, 1)'} : {}} className="title">{selectedItem.name}</p>
					<p>{selectedItem.dnc ? '❌ DNC' : selectedItem.intake_only ? '⚠️ INTAKE ONLY' : ''}</p>
				</div>
				{/* Contact Detalis/Info */}
				<div className="bg-gray-200/70 p-3 rounded-xl mt-3 text-xl">
					{selectedItem.title && <div>
						<label className="text-sm">Title</label>
						<p className="mb-2">{selectedItem.title}</p>
					</div>}
					{selectedItem.email && <div>
						<label className="text-sm">Email</label>
						<p className="mb-2">{selectedItem.email}</p>
					</div>}
					{selectedItem.phone && <div>
						<label className="text-sm">Phone Number</label>
						<p className="mb-2">{selectedItem.phone}</p>
					</div>}
					{selectedItem.preferences && <div>
						<label className="text-sm">Preferences</label>
						<p className="mb-2">{selectedItem.preferences}</p>
					</div>}
					{selectedItem.contact_type && <div>
						<label className="text-sm">Contact Type</label>
						<p className="mb-2">{selectedItem.contact_type}</p>
					</div>}

					{/* TODO: Pharmacies */}
				</div>
			</>
		);
	}
}