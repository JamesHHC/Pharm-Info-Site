import React from 'react';

export default function PharmacyFormModal({ isOpen, onClose, onSubmit }) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-[5px] flex items-center justify-center z-600">
			<div className="bg-white p-6 rounded-lg shadow-2xl w-150 max-h-[90vh] overflow-y-auto scrollbar-thin">
				<h1 className="mb-4">Add New Pharmacy</h1>
				<form onSubmit={onSubmit}>

					{/* Pharmacy Name */}
					<label htmlFor="name" className="block text-sm font-light text-gray-700 mb-1">
						Pharmacy Name <span className="text-red-500">*</span>
					</label>
					<input
						required id="name" name="name" type="text" placeholder="Type here..." autoComplete="off"
						className="w-full mb-3 border border-gray-300 p-2 rounded focus:outline-cyan-500/60"
					/>

					{/* Verbal Orders */}
					<div className="flex items-center">
						<input 
							id="verbal_orders" name="verbal_orders" type="checkbox"
							className="mb-3 p-2 w-5 h-5 accent-cyan-800 focus:outline-offset-0 focus:outline-cyan-500/60"
						/>
						<label htmlFor="verbal_orders" className="block text-sm font-light text-gray-700 mb-3 p-2 items">Verbal Orders Allowed</label>
					</div>

					{/* Communication Prefs */}
					<label htmlFor="name" className="block text-sm font-light text-gray-700 mb-1">Communication Preferences</label>
					<textarea
						id="communication" name="communication" placeholder="Type here..."
						className="w-full mb-3 border border-gray-300 p-2 rounded focus:outline-cyan-500/60"
					/>

					{/* General Notes */}
					<label htmlFor="name" className="block text-sm font-light text-gray-700 mb-1">General Notes</label>
					<textarea
						id="general_notes" name="general_notes" placeholder="Type here..."
						className="w-full mb-3 border border-gray-300 p-2 rounded focus:outline-cyan-500/60"
					/>

					{/* On-call Prefs */}
					<label htmlFor="name" className="block text-sm font-light text-gray-700 mb-1">On-call Preferences</label>
					<textarea
						id="oncall_prefs" name="oncall_prefs" placeholder="Type here..."
						className="w-full mb-3 border border-gray-300 p-2 rounded focus:outline-cyan-500/60"
					/>
					
					{/* Rules */}
					<label className="block text-sm font-light text-gray-700 mb-1">Rules</label>
					<p className="mb-3">Placeholder</p>
					{/* TODO */}

					{/* Training Req */}
					<label className="block text-sm font-light text-gray-700 mb-1">Training Requirements</label>
					<p className="mb-3">Placeholder</p>
					{/* TODO */}

					{/* Contacts */}
					<label className="block text-sm font-light text-gray-700 mb-1">Contacts</label>
					<p className="mb-3">Placeholder</p>
					{/* TODO */}

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