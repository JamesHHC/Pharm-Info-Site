import React, { useState } from 'react';
import './ModalStyles.css'

export default function ContactFormModal({ isOpen, onClose, onSubmit, pharmacies }) {
	// For pharmacies
	const [searchedPharmacy, setSearchedPharmacy] = useState('');
	const [selectedPharmacies, setSelectedPharmacies] = useState([]);

	// Reset fields w/in form
	const resetForm = () => {
		// Reset pharmacy stuff
		setSearchedPharmacy('');
		setSelectedPharmacies([]);
	};

	// Run when form submitted
	const handleSubmit = async (e) => {
		e.preventDefault();
		await onSubmit(e, selectedPharmacies);
		resetForm();
		onClose();
	};

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

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-[5px] flex items-center justify-center z-40">
			<div className="bg-white p-6 rounded-lg shadow-2xl w-150 max-h-[90vh] overflow-y-auto scrollbar-thin">
				<p className="modal-title mb-4">Add New Contact</p>
				<form onSubmit={handleSubmit}>
					
					{/* Contact Name */}
					<label htmlFor="name" className="block text-sm font-light text-gray-700 mb-1">
						Contact Name <span className="text-red-500">*</span>
					</label>
					<input
						required id="name" name="name" type="text" placeholder="Type here..." autoComplete="off"
						className="w-full mb-3 border border-gray-300 p-2 rounded focus:outline-cyan-500/60"
					/>

					{/* DNC/Intake-Only */}
					<div className="flex items-center mb-1.5">
						<input 
							tabIndex="-1" id="dnc" name="dnc" type="checkbox"
							className="appearance-none flex-none custom-chk transition border-1 border-gray-300 w-5 h-5 focus:outline-cyan-500/60 checked:border-0 checked:bg-cyan-800 rounded-full"
						/>
						<label htmlFor="dnc" className="block text-sm p-2 items mr-4">❌DNC</label>
						<input 
							tabIndex="-1" id="intake_only" name="intake_only" type="checkbox"
							className="appearance-none flex-none custom-chk transition border-1 border-gray-300 w-5 h-5 focus:outline-cyan-500/60 checked:border-0 checked:bg-cyan-800 rounded-full"
						/>
						<label htmlFor="intake_only" className="block text-sm p-2 items">⚠️Intake Only</label>
					</div>

					{/* Contact Type */}
					<p className="block text-sm font-light text-gray-700 mb-1">Contact Type</p>
					<div tabIndex="-1" className="flex-wrap bg-gray-100 resize-y mb-3 border border-gray-300 p-2 rounded h-24 w-full overflow-auto space-x-2 space-y-2 scrollbar-thin">
						{['Accounts Receivable', 'Care Coordination', 'Clinical', 'Compliance', 'Documentation', 'Executive', 'Intake', 'On-call'].map((type) => (
							<label htmlFor={`contact_type_${type}`} key={type} className="flex-none inline-flex items-center bg-white p-2 shadow-sm rounded-full">
								<input
									tabIndex="-1"
									type="checkbox"
									id={`contact_type_${type}`}
									name="contact_type"
									value={type}
									className="appearance-none flex-none custom-chk transition border-1 border-gray-300 mr-2 w-5 h-5 focus:outline-cyan-500/60 checked:border-0 checked:bg-cyan-800 pointer-events-none rounded-full"
								/>
								<span className="text-sm">{type}</span>
							</label>
						))}
					</div>

					{/* Title */}
					<label htmlFor="title" className="block text-sm font-light text-gray-700 mb-1">Title</label>
					<input
						id="title" name="title" type="text" placeholder="Type here..." autoComplete="off"
						className="w-full mb-3 border border-gray-300 p-2 rounded focus:outline-cyan-500/60"
					/>

					{/* Email */}
					<label htmlFor="email" className="block text-sm font-light text-gray-700 mb-1">Email</label>
					<input
						id="email" name="email" type="text" placeholder="Type here..." autoComplete="off"
						className="w-full mb-3 border border-gray-300 p-2 rounded focus:outline-cyan-500/60"
					/>

					{/* Phone Number */}
					<label htmlFor="phone" className="block text-sm font-light text-gray-700 mb-1">Phone Number</label>
					<input
						id="phone" name="phone" type="text" placeholder="Type here..." autoComplete="off"
						className="w-full mb-3 border border-gray-300 p-2 rounded focus:outline-cyan-500/60"
					/>

					{/* Preferences */}
					<label htmlFor="preferences" className="block text-sm font-light text-gray-700 mb-1">Preferences</label>
					<textarea
						id="preferences" name="preferences" placeholder="Type here..."
						className="w-full mb-1.5 border border-gray-300 p-2 rounded focus:outline-cyan-500/60 scrollbar-thin"
					/>

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
					
					{/* Cancel/Submit Buttons */}
					<div className="flex justify-end space-x-2">
						<button type="button" onClick={() => {onClose(); resetForm();}} className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-400 hover:bg-gray-300 rounded focus:outline-cyan-500/60">Cancel</button>
						<button type="submit" className="cursor-pointer px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded focus:outline-cyan-500/60">Submit</button>
					</div>

				</form>
			</div>
		</div>
	);
}