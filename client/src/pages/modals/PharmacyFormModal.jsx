import React, { useEffect, useState } from 'react';
import './ModalStyles.css'

export default function PharmacyFormModal({ isOpen, onClose, onSubmit }) {
	// For rules
	const [loading, setLoading] = useState(false);
	const [rules, setRules] = useState([]);
	const [searchedRule, setSearchedRule] = useState('');
	const [selectedRules, setSelectedRules] = useState([]);

	useEffect(() => {
		if (isOpen) {
			// Fetch when modal opens
			setLoading(true);
			fetch('http://localhost:5000/api/rules')
				.then((res) => res.json())
				.then((data) => setRules(data))
				.catch((err) => console.error('Failed to fetch rules', err))
				.finally(() => setLoading(false));
		}
	}, [isOpen]);

	// Reset fields w/in form
	const resetForm = () => {
		setSearchedRule('');
		setSelectedRules([]);
	};

	// Run when form submitted
	const handleSubmit = async (e) => {
		e.preventDefault();
		await onSubmit(e, selectedRules);
		resetForm();
		onClose();
	};

	// Keep track of selected rules during filtering
	const handleRuleChange = (id) => {
		setSelectedRules(prevSelected =>
			prevSelected.includes(id)
				? prevSelected.filter(rid => rid !== id)
				: [...prevSelected, id]
		);
	};

	// Filter rules based on user input
	const filteredRules = rules.filter((rule) =>
		rule.rule.toLowerCase().includes(searchedRule.toLowerCase())
	);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-[5px] flex items-center justify-center z-600">
			<div className="bg-white p-6 rounded-lg shadow-2xl w-150 max-h-[90vh] overflow-y-auto scrollbar-thin">
				<p className="modal-title mb-4">Add New Pharmacy</p>
				<form onSubmit={handleSubmit}>

					{/* Pharmacy Name */}
					<label htmlFor="name" className="block text-sm font-light text-gray-700 mb-1">
						Pharmacy Name <span className="text-red-500">*</span>
					</label>
					<input
						required id="name" name="name" type="text" placeholder="Type here..." autoComplete="off"
						className="w-full mb-3 border border-gray-300 p-2 rounded focus:outline-cyan-500/60"
					/>

					{/* Verbal Orders */}
					<div className="flex items-center mb-1.5">
						<input 
							id="verbal_orders" name="verbal_orders" type="checkbox"
							className="appearance-none custom-chk transition border-1 border-gray-300 w-5 h-5 focus:outline-cyan-500/60 checked:border-0 checked:bg-cyan-800 rounded-full"
						/>
						<label htmlFor="verbal_orders" className="block text-sm p-2 items">Verbal Orders Allowed</label>
					</div>

					{/* Communication Prefs */}
					<label htmlFor="name" className="block text-sm font-light text-gray-700 mb-1">Communication Preferences</label>
					<textarea
						id="communication" name="communication" placeholder="Type here..."
						className="w-full mb-1.5 border border-gray-300 p-2 rounded focus:outline-cyan-500/60 scrollbar-thin"
					/>

					{/* General Notes */}
					<label htmlFor="name" className="block text-sm font-light text-gray-700 mb-1">General Notes</label>
					<textarea
						id="general_notes" name="general_notes" placeholder="Type here..."
						className="w-full mb-1.5 border border-gray-300 p-2 rounded focus:outline-cyan-500/60 scrollbar-thin"
					/>

					{/* On-call Prefs */}
					<label htmlFor="name" className="block text-sm font-light text-gray-700 mb-1">On-call Preferences</label>
					<textarea
						id="oncall_prefs" name="oncall_prefs" placeholder="Type here..."
						className="w-full mb-1.5 border border-gray-300 p-2 rounded focus:outline-cyan-500/60 scrollbar-thin"
					/>
					
					{/* Rules */}
					<p className="block text-sm font-light text-gray-700 mb-1">Rules</p>
					{loading && <p className="mb-3">Loading rules...</p>}
					{rules.length > 0 && <>
						<div className="flex mb-1 space-x-1">
							{/* Rule search bar */}
							<input
								tabIndex="-1"
								id="rules-search-bar"
								type="text"
								placeholder="Search rules..."
								value={searchedRule}
								onChange={(e) => setSearchedRule(e.target.value)}
								className="h-10.5 w-full px-4 border border-gray-300 rounded-md focus:outline-cyan-500/60"
							/>
							{/* New rule button */}
							<button
								tabIndex="-1"
								type="button"
								onClick={() => {return;}}
								className="w-12 h-10.5 text-4xl text-teal-600/60 border-2 border-teal-600/60 rounded-md hover:border-0 hover:text-white hover:bg-teal-600/60"
							>
								<span className="relative bottom-[5px] font-medium">+</span>
							</button>
						</div>
						{/* Rule list */}
						<div className="resize-y mb-4 border bg-gray-100 border-gray-300 p-2 rounded h-40 w-full overflow-y-auto overflow-x-hidden space-y-2 space-x-2 scrollbar-thin">
							{filteredRules.map((rule) => {
								const isVisible = rule.rule.toLowerCase().includes(searchedRule.toLowerCase());
								return (
									<label
										htmlFor={`rule_${rule.rule}`}
										key={rule.rule}
										className={`flex w-full items-center bg-white p-2 rounded-md shadow-sm ${!isVisible ? 'hidden' : ''}`}
									>
										<input
											type="checkbox"
											id={`rule_${rule.rule}`}
											name="rule"
											value={rule.id}
											checked={selectedRules.includes(rule.id)}
											onChange={() => handleRuleChange(rule.id)}
											className="appearance-none flex-none custom-chk transition border-1 border-gray-300 mr-2 w-5 h-5 focus:outline-cyan-500/60 checked:border-0 checked:bg-cyan-800 pointer-events-none rounded-full"
										/>
											<span className="text-sm">{rule.rule}</span>
									</label>
								);
							})}
						</div>
					</>}

					{/* Training Req */}
					<p className="block text-sm font-light text-gray-700 mb-1">Training Requirements</p>
					<p className="mb-3">{/* TODO */}</p>

					{/* Contacts */}
					<p className="block text-sm font-light text-gray-700 mb-1">Contacts</p>
					<p className="mb-3">{/* TODO */}</p>

					{/* Cancel/Submit Buttons */}
					<div className="flex justify-end space-x-2">
						<button type="button" onClick={() => {onClose(); resetForm();}} className="px-4 py-2 bg-gray-200 text-gray-400 hover:bg-gray-300 rounded">Cancel</button>
						<button type="submit" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded">Add</button>
					</div>

				</form>
			</div>
		</div>
	);
}