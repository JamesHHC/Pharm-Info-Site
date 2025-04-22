import React from 'react';

export default function ContactFormModal({ isOpen, onClose, onSubmit }) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-[5px] flex items-center justify-center z-600">
			<div className="bg-white p-6 rounded-lg shadow-2xl w-150">
				<h1 className="mb-4">Add Contact</h1>
				<form onSubmit={onSubmit}>
					<input type="text" name="name" placeholder="Pharmacy name" className="w-full mb-2 border p-2 rounded" />
					<textarea name="notes" placeholder="General notes" className="w-full mb-2 border p-2 rounded" />
					<div className="flex justify-end space-x-2">
						<button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded">Cancel</button>
						<button type="submit" className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded">Save</button>
					</div>
				</form>
			</div>
		</div>
	);
}