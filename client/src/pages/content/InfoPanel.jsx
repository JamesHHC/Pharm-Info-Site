import React from 'react';

let lastItem = null;

export default function InfoPanel({selectedItem}) {
	if (!selectedItem) return <div className="flex h-full"><h4 className="m-auto">Select a pharmacy or contact to view its details.</h4></div>;

	// Pharmacy
	if (selectedItem?.verbal_orders !== undefined) {
		return (
			<>
				<h5>Pharmacy Info</h5>
				<h0>{selectedItem.name}</h0>
			</>
		);
	}
	// Contact
	else {
		return (
			<>
				<h5>Contact Info</h5>
				<h0 style={selectedItem.dnc ? {color: 'rgba(200, 80, 80, 1)'} : selectedItem.intake_only ?
					{color: 'rgba(240, 180, 100, 1)'} : {}}>{selectedItem.name}</h0>
			</>
		);
	}
}