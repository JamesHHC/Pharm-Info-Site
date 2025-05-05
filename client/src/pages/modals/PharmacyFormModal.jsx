import React, { useEffect, useState } from 'react';
import './ModalStyles.css'
import config from '../../config.js';

const serverIp = config.server_ip;
const serverPort = config.server_port;

export default function PharmacyFormModal({ isOpen, onClose, onSubmit }) {
	// For rules
	const [loadingRules, setLoadingRules] = useState(false);
	const [rules, setRules] = useState([]);
	const [searchedRule, setSearchedRule] = useState('');
	const [selectedRules, setSelectedRules] = useState([]);
	const [newRule, setNewRule] = useState('');

	// For trainings
	const [loadingTrainings, setLoadingTrainings] = useState(false);
	const [trainings, setTrainings] = useState([]);
	const [searchedTraining, setSearchedTraining] = useState('');
	const [selectedTrainings, setSelectedTrainings] = useState([]);
	const [newTraining, setNewTraining] = useState({name: '', description: ''});

	// GET rules
	const fetchRules = () => {
		setLoadingRules(true);
		fetch(`http://${serverIp}:${serverPort}/api/rules`)
			.then((res) => res.json())
			.then((data) => setRules(data))
			.catch((err) => console.error('Failed to fetch rules', err))
			.finally(() => setLoadingRules(false));
	}

	// GET trainings
	const fetchTrainings = () => {
		setLoadingTrainings(true);
		fetch(`http://${serverIp}:${serverPort}/api/training`)
			.then((res) => res.json())
			.then((data) => setTrainings(data))
			.catch((err) => console.error('Failed to fetch trainings', err))
			.finally(() => setLoadingTrainings(false));
	}

	useEffect(() => {
		if (isOpen) {
			// Fetch when modal opens
			fetchRules();
			fetchTrainings();
		}
	}, [isOpen]);

	// Reset fields w/in form
	const resetForm = () => {
		// Reset rule stuff
		setSearchedRule('');
		setSelectedRules([]);
		setNewRule('');
		// Reset training stuff
		setSearchedTraining('');
		setSelectedTrainings([]);
		setNewTraining({name: '', description: ''});
	};

	// Run when form submitted
	const handleSubmit = async (e) => {
		e.preventDefault();
		await onSubmit(e, selectedRules, selectedTrainings);
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

	// Reset newRule when New Rule subform cancelled
	const cancelNewRule = () => {
		document.getElementById('new-rule-form').hidden = true;
		setNewRule('');
	};

	// Handle submission of newRule to db when New Rule subform submitted
	const submitNewRule = async () => {
		const nRule = newRule.trim();
		if (nRule === '') return;
		document.getElementById('new-rule-form').hidden = true;
		setNewRule('');

		// Send info to db
		const res = await fetch(`http://${serverIp}:${serverPort}/api/rules`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ rule: nRule }),
		});
		const ruleJson = await res.json();
		await fetchRules();
		handleRuleChange(ruleJson.id);
	};

	// Keep track of selected trainings during filtering
	const handleTrainingChange = (id) => {
		setSelectedTrainings(prevSelected =>
			prevSelected.includes(id)
				? prevSelected.filter(rid => rid !== id)
				: [...prevSelected, id]
		);
	};

	// Filter trainings based on user input
	const filteredTrainings = trainings.filter((training) =>
		training.name.toLowerCase().includes(searchedTraining.toLowerCase()) ||
		training.description.toLowerCase().includes(searchedTraining.toLowerCase())
	);

	// Reset newTraining when New Training subform cancelled
	const cancelNewTraining = () => {
		document.getElementById('new-training-form').hidden = true;
		setNewTraining({name: '', description: ''});
	};

	// Handle submission of newTraining to db when New Training subform submitted
	const submitNewTraining = async () => {
		const nTrain = {
			name: newTraining?.name?.trim(),
			description: newTraining?.description?.trim(),
		};
		if (nTrain.name === '' || nTrain.description === '') return;
		document.getElementById('new-training-form').hidden = true;
		setNewTraining({name: '', description: ''});
		// Send info to db
		const res = await fetch(`http://${serverIp}:${serverPort}/api/training`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(nTrain),
		});
		const trainJson = await res.json();
		await fetchTrainings();
		handleTrainingChange(trainJson.id);
	}

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-[5px] flex items-center justify-center z-40">
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
							tabIndex="-1" id="verbal_orders" name="verbal_orders" type="checkbox"
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
					{loadingRules && <p className="mb-4 border bg-gray-100 border-gray-300 p-2 rounded">Loading rules...</p>}
					{/* Search/add bar */}
					<div className="flex mb-1 space-x-1">
						{/* Rule search bar */}
						<input
							id="rules-search-bar"
							type="text"
							placeholder="Search rules..."
							value={searchedRule}
							onChange={(e) => setSearchedRule(e.target.value)}
							className="h-10.5 w-full px-4 border border-gray-300 rounded-md focus:outline-cyan-500/60"
							autoComplete="off"
						/>
						{/* New rule button */}
						<button
							tabIndex="-1"
							type="button"
							onClick={() => {document.getElementById('new-rule-form').hidden = false}}
							className="text-teal-600/60 border-2 border-teal-600/60 rounded-md hover:border-teal-600/0 hover:text-white hover:bg-teal-600/60"
						>
							<span className="px-4 py-2 font-medium">Add</span>
						</button>
					</div>
					{/* New rule form */}
					<div hidden id="new-rule-form" className="my-1 rounded bg-sky-100 border-2 border-cyan-500/60 p-2">
						<p className="block text-sm font-light text-gray-700 mb-1">New Rule</p>
						<div className="space-y-2">
							<input
								id="new-rule-input"
								type="text"
								placeholder="Enter rule..."
								value={newRule}
								onChange={(e) => setNewRule(e.target.value)} 
								className="h-10.5 w-full px-4 border border-gray-200 rounded-md bg-white/80 focus:outline-cyan-500/60"
								autoComplete="off"
							/>
							<div className="flex justify-end">
								<button tabIndex="-1" type="button" onClick={cancelNewRule} className="px-4 py-2 bg-gray-800/10 text-gray-400 hover:bg-gray-800/20 rounded-l-md">Cancel</button>
								<button tabIndex="-1" type="button" onClick={submitNewRule} className="px-4 py-2 bg-teal-600/60 hover:bg-teal-600/80 text-white rounded-r-md">Save</button>
							</div>
						</div>
					</div>
					{/* Rule list */}
					<div tabIndex="-1" className="resize-y mb-4 border bg-gray-100 border-gray-300 p-2 rounded h-80 w-full overflow-y-auto overflow-x-hidden space-y-2 space-x-2 scrollbar-thin">
						{filteredRules.map((rule) => {
							const isVisible = rule.rule.toLowerCase().includes(searchedRule.toLowerCase());
							return (
								<div 
									className={`flex justify-between w-full items-center bg-white rounded-md shadow-sm ${!isVisible ? 'hidden' : ''}`}
									key={rule.rule}
								>
									<label
										htmlFor={`rule_${rule.id}`}
										className="w-full p-2"
									>
										<div className="flex items-center">
											<input
												tabIndex="-1"
												type="checkbox"
												id={`rule_${rule.id}`}
												name="rule"
												value={rule.id}
												checked={selectedRules.includes(rule.id)}
												onChange={() => handleRuleChange(rule.id)}
												className="appearance-none flex-none custom-chk transition border-1 border-gray-300 mr-2 w-5 h-5 focus:outline-cyan-500/60 checked:border-0 checked:bg-cyan-800 pointer-events-none rounded-full"
											/>
											<span className="text-sm">{rule.rule}</span>
										</div>
									</label>
									{/* Edit icon */}
									<div className="cursor-pointer relative group inline-block ml-2">
										<span className="px-2 edit-icon"></span>
									</div>
								</div>
							);
						})}
					</div>

					{/* Training Req */}
					<p className="block text-sm font-light text-gray-700 mb-1">Training Requirements</p>
					{loadingTrainings && <p className="mb-4 border bg-gray-100 border-gray-300 p-2 rounded">Loading trainings...</p>}
					{/* Search/add bar */}
					<div className="flex mb-1 space-x-1">
						{/* Training search bar */}
						<input
							id="training-search-bar"
							type="text"
							placeholder="Search trainings..."
							value={searchedTraining}
							onChange={(e) => setSearchedTraining(e.target.value)}
							className="h-10.5 w-full px-4 border border-gray-300 rounded-md focus:outline-cyan-500/60"
							autoComplete="off"
						/>
						{/* New training button */}
						<button
							tabIndex="-1"
							type="button"
							onClick={() => {document.getElementById('new-training-form').hidden = false}}
							className="text-teal-600/60 border-2 border-teal-600/60 rounded-md hover:border-teal-600/0 hover:text-white hover:bg-teal-600/60"
						>
							<span className="px-4 py-2 font-medium">Add</span>
						</button>
					</div>
					{/* New training form */}
					<div hidden id="new-training-form" className="my-1 rounded bg-sky-100 border-2 border-cyan-500/60 p-2">
						<p className="block text-sm font-light text-gray-700 mb-1">New Training</p>
						<div className="space-y-1">
							<input
								id="new-training-name"
								type="text"
								placeholder="Enter training name..."
								value={newTraining.name}
								onChange={(e) => setNewTraining({name: e.target.value, description: newTraining.description})}
								className="bg-white/80 h-10.5 w-full px-4 border border-gray-200 rounded-md focus:outline-cyan-500/60"
								autoComplete="off"
							/>
							<textarea
								id="new-training-desc"
								placeholder="Enter training description..."
								value={newTraining.description}
								onChange={(e) => setNewTraining({name: newTraining.name, description: e.target.value})} 
								className="bg-white/80 h-15 w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-cyan-500/60"
							/>
							<div className="flex justify-end">
								<button tabIndex="-1" type="button" onClick={cancelNewTraining} className="px-4 py-2 bg-gray-800/10 text-gray-400 hover:bg-gray-800/20 rounded-l-md">Cancel</button>
								<button tabIndex="-1" type="button" onClick={submitNewTraining} className="px-4 py-2 bg-teal-600/60 hover:bg-teal-600/80 text-white rounded-r-md">Save</button>
							</div>
						</div>
					</div>
					{/* Training list */}
					<div tabIndex="-1" className="resize-y mb-4 border bg-gray-100 border-gray-300 p-2 rounded h-80 w-full overflow-y-auto overflow-x-hidden space-y-2 space-x-2 scrollbar-thin">
						{filteredTrainings.map((training) => {
							const isVisible = training.name.toLowerCase().includes(searchedTraining.toLowerCase()) || training.description.toLowerCase().includes(searchedTraining.toLowerCase());
							return (
								<div
									className={`bg-white flex w-full items-center justify-between rounded-md shadow-sm ${!isVisible ? 'hidden' : ''}`}
									key={training.name}
								>
									<label htmlFor={`training_${training.id}`} className="w-full p-2">
										<div className="flex items-center">
											<input
												tabIndex="-1"
												type="checkbox"
												id={`training_${training.id}`}
												name="training"
												value={training.id}
												checked={selectedTrainings.includes(training.id)}
												onChange={() => handleTrainingChange(training.id)}
												className="appearance-none flex-none custom-chk transition border-1 border-gray-300 mr-2 w-5 h-5 focus:outline-cyan-500/60 checked:border-0 checked:bg-cyan-800 pointer-events-none rounded-full"
											/>
											<span className="text-sm">{training.name}</span>
										</div>
									</label>
									{/* Edit icon */}
									<div className="cursor-pointer relative group inline-block ml-2">
										<span className="px-2 edit-icon"></span>
									</div>
								</div>
							);
						})}
					</div>

					{/* Contacts */}
					<p className="block text-sm font-light text-gray-700 mb-1">Contacts</p>
					<p className="mb-3">{/* TODO */}</p>

					{/* Cancel/Submit Buttons */}
					<div className="flex justify-end space-x-2">
						<button type="button" onClick={() => {onClose(); resetForm();}} className="px-4 py-2 bg-gray-200 text-gray-400 hover:bg-gray-300 rounded focus:outline-cyan-500/60">Cancel</button>
						<button type="submit" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded focus:outline-cyan-500/60">Submit</button>
					</div>

				</form>
			</div>
		</div>
	);
}