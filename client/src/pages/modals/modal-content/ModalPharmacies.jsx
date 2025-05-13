// React
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';

// Styles
import '../ModalStyles.css'

// Config
import config from '../../../config.js';
const serverIp = config.server_ip;
const serverPort = config.server_port;

const ModalPharmacies = forwardRef(({selectedPharmacies, setSelectedPharmacies, pharmacies}, ref) => {
	const [searchedPharmacy, setSearchedPharmacy] = useState('');

	// Reset fields w/in form
	const resetPharmaciesForm = () => {
		// Reset pharmacy stuff
		setSearchedPharmacy('');
		setSelectedPharmacies([]);
	};

	useImperativeHandle(ref, () => ({
        resetPharmaciesForm
    }));

    // Keep track of selected pharmacies during filtering
	const handlePharmacyChange = (id) => {
		setSelectedPharmacies(prevSelected =>
			prevSelected.includes(id)
				? prevSelected.filter(pid => pid !== id)
				: [...prevSelected, id]
		);
	};

	// Filter pharmacies based on user input
	const filteredPharmacies = pharmacies
		.slice()
		.sort((a, b) => a.name.localeCompare(b.name))
		.filter((pharmacy) =>
			pharmacy.name.toLowerCase().includes(searchedPharmacy.toLowerCase())
		);

	return (<>
		{/* Pharmacies */}
		<p className="block text-sm font-light text-gray-700 mb-1">Pharmacies</p>
		{/* Pharmacy search bar */}
		<input
			id="pharmacies-search-bar"
			type="text"
			placeholder="Search pharmacies..."
			value={searchedPharmacy}
			onChange={(e) => setSearchedPharmacy(e.target.value)}
			className="flex mb-1 h-10.5 w-full px-4 border border-gray-300 rounded-md focus:outline-cyan-500/60"
			autoComplete="off"
		/>
		{/* Pharmacy List */}
		<div tabIndex="-1" className="resize-y mb-4 border bg-gray-100 border-gray-300 p-2 rounded h-40 w-full overflow-y-auto overflow-x-hidden space-y-2 space-x-2 scrollbar-thin">
			{filteredPharmacies.map((pharmacy) => {
				const isVisible = pharmacy.name.toLowerCase().includes(searchedPharmacy.toLowerCase());
				return (
					<div
						className={`bg-white flex w-full items-center justify-between rounded-md shadow-sm ${!isVisible ? 'hidden' : ''}`}
						key={pharmacy.name}
					>
						<label htmlFor={`pharmacy_${pharmacy.id}`} className="w-full p-2">
							<div className="flex items-center">
								<input
									tabIndex="-1"
									type="checkbox"
									id={`pharmacy_${pharmacy.id}`}
									name="pharmacy"
									value={pharmacy.id}
									checked={selectedPharmacies.includes(pharmacy.id)}
									onChange={() => handlePharmacyChange(pharmacy.id)}
									className="appearance-none flex-none custom-chk transition border-1 border-gray-300 mr-2 w-5 h-5 focus:outline-cyan-500/60 checked:border-0 checked:bg-cyan-800 pointer-events-none rounded-full"
								/>
								{/* Pharmacy info */}
								<div className="flex-block">
									<p className="text-sm">{pharmacy.name}</p>
								</div>
							</div>
						</label>
					</div>
				);
			})}
		</div>
	</>);
});

export default ModalPharmacies;