// React
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';

// Styles
import '../ModalStyles.css'

// Config
import config from '../../../config.js';
const serverIp = config.server_ip;
const serverPort = config.server_port;

const ModalRules = forwardRef(({selectedRules, setSelectedRules}, ref) => {
	const [loadingRules, setLoadingRules] = useState(false);
	const [rules, setRules] = useState([]);
	const [searchedRule, setSearchedRule] = useState('');
	const [newRule, setNewRule] = useState('');
	const [editedRule, setEditedRule] = useState({ref: {}, new: ''});

	// GET rules
	const fetchRules = () => {
		setLoadingRules(true);
		fetch(`http://${serverIp}:${serverPort}/api/rules`)
			.then((res) => res.json())
			.then((data) => setRules(data))
			.catch((err) => console.error('Failed to fetch rules', err))
			.finally(() => setLoadingRules(false));
	};

	useEffect(() => {
		// Fetch when modal opens
		fetchRules();
	}, []);

	// Reset fields w/in form
	const resetRulesForm = () => {
		// Reset rule stuff
		setSearchedRule('');
		setSelectedRules([]);
		setNewRule('');
		setEditedRule({ref: {}, new: ''});
	};

	useImperativeHandle(ref, () => ({
        resetRulesForm
    }));

	// Keep track of selected rules during filtering
	const handleRuleChange = (id) => {
		setSelectedRules(prevSelected =>
			prevSelected.includes(id)
				? prevSelected.filter(rid => rid !== id)
				: [...prevSelected, id]
		);
	};

	// Filter rules based on user input
	const filteredRules = rules
		.slice()
		.sort((a, b) => a.rule.localeCompare(b.rule))
		.filter((rule) =>
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

	// Reset editedRule when Edit Rule subform cancelled
	const cancelEditRule = async () => {
		document.getElementById('edit-rule-form').hidden = true;
		setEditedRule({ref: {}, new: ''});
	};

	// Handle db update based on editedRule
	const submitEditRule = async () => {
		const eId = editedRule.ref.id;
		const eRule = editedRule.new.trim();
		if (eRule === '' || editedRule.ref.rule === eRule) return;
		document.getElementById('edit-rule-form').hidden = true;
		setEditedRule({ref: {}, new: ''});

		// Send info to db
		await fetch(`http://${serverIp}:${serverPort}/api/rules`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ rule: eRule, id: eId }),
		});
		fetchRules();
	};

	return (<>
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
				onClick={() => {
					// Prevent new/edit from opening at the same time
					if (!document.getElementById('edit-rule-form').hidden) return;
					document.getElementById('new-rule-form').hidden = false;
				}}
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
					<button tabIndex="-1" type="button" onClick={cancelNewRule} className="cursor-pointer px-4 py-2 bg-gray-800/10 text-gray-400 hover:bg-gray-800/20 rounded-l-md">Cancel</button>
					<button tabIndex="-1" type="button" onClick={submitNewRule} className="cursor-pointer px-4 py-2 bg-teal-600/60 hover:bg-teal-600/80 text-white rounded-r-md">Save</button>
				</div>
			</div>
		</div>
		{/* Edit rule form */}
		<div hidden id="edit-rule-form" className="my-1 rounded bg-orange-100 border-2 border-amber-500/60 p-2">
			<p className="block text-sm font-light text-gray-700 mb-1">Edit Rule</p>
			<div className="space-y-2">
				<input
					id="edit-rule-input"
					type="text"
					placeholder="Make your changes here..."
					value={editedRule.new}
					onChange={(e) => setEditedRule({ref: editedRule.ref, new: e.target.value})} 
					className="h-10.5 w-full px-4 border border-gray-200 rounded-md bg-white/80 focus:outline-amber-500/60"
					autoComplete="off"
				/>
				<div className="flex justify-end">
					<button tabIndex="-1" type="button" onClick={cancelEditRule} className="cursor-pointer px-4 py-2 bg-gray-800/10 text-gray-400 hover:bg-gray-800/20 rounded-l-md">Cancel</button>
					<button tabIndex="-1" type="button" onClick={submitEditRule} className="cursor-pointer px-4 py-2 bg-orange-600/60 hover:bg-orange-600/80 text-white rounded-r-md">Save</button>
				</div>
			</div>
		</div>
		{/* Rule list */}
		<div tabIndex="-1" className="resize-y mb-4 border bg-gray-100 border-gray-300 p-2 rounded h-40 w-full overflow-y-auto overflow-x-hidden space-y-2 space-x-2 scrollbar-thin">
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
						<div
							className="cursor-pointer relative group inline-block ml-2"
							onClick={() => {
								// Prevent new/edit from opening at the same time
								if (!document.getElementById('new-rule-form').hidden) return;
								setEditedRule({ref: rule, new: rule.rule});
								document.getElementById('edit-rule-form').hidden = false;
							}}
						>
							<span className="px-2 edit-icon"></span>
						</div>
					</div>
				);
			})}
		</div>
	</>);
});

export default ModalRules;