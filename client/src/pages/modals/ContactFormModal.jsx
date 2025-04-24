import React from 'react';

export default function ContactFormModal({ isOpen, onClose, onSubmit }) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-[5px] flex items-center justify-center z-600">
			<div className="bg-white p-6 rounded-lg shadow-2xl w-150 max-h-[90vh] overflow-y-auto scrollbar-thin">
				<h1 className="mb-4">Add New Contact</h1>
				<form onSubmit={onSubmit}>
					
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
							id="dnc" name="dnc" type="checkbox"
							className="p-2 w-5 h-5 accent-cyan-800 focus:outline-offset-0 focus:outline-cyan-500/60"
						/>
						<label htmlFor="dnc" className="block text-sm p-2 items mr-4">❌DNC</label>
						<input 
							id="intake_only" name="intake_only" type="checkbox"
							className=" p-2 w-5 h-5 accent-cyan-800 focus:outline-offset-0 focus:outline-cyan-500/60"
						/>
						<label htmlFor="intake_only" className="block text-sm p-2 items">⚠️Intake Only</label>
					</div>

					{/* Contact Type */}
					<label htmlFor="contact_types" className="block text-sm font-light text-gray-700 mb-1">Contact Type</label>
					<div id="contact_types" className="resize-y mb-3 border border-gray-300 p-2 rounded h-26 w-full overflow-y-auto space-y-1 scrollbar-thin">
						{['Accounts Receivable', 'Care Coordination', 'Clinical', 'Compliance', 'Documentation', 'Executive', 'Intake', 'On-call'].map((type) => (
							<div key={type} className="flex items-center">
								<input
									type="checkbox"
									id={`contact_type_${type}`}
									name="contact_type"
									value={type}
									className="mr-2 w-4 h-4 accent-cyan-800 focus:outline-cyan-500/60"
								/>
								<label htmlFor={`contact_type_${type}`} className="text-sm">
									{type}
								</label>
							</div>
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
						className="w-full mb-1.5 border border-gray-300 p-2 rounded focus:outline-cyan-500/60"
					/>

					{/* Pharmacies */}
					<label className="block text-sm font-light text-gray-700 mb-1">Pharmacies</label>
					<p className="mb-3">{/* TODO */}</p>
					
					{/* Cancel/Submit Buttons */}
					<div className="flex justify-end space-x-2">
						<button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-400 hover:bg-gray-300 rounded">Cancel</button>
						<button type="submit" className="px-4 py-2 bg-green-500/80 hover:bg-green-600/80 text-white rounded">Add</button>
					</div>

				</form>
			</div>
		</div>
	);
}