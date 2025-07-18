// React
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';

// Auth
import { useAuth } from '@/auth/AuthContext';
import { hasMinPermission } from '@/auth/checkRole';

// Content
import TrashIcon from '@/assets/icons/TrashIcon';
import RichTextarea from '@/pages/components/RichTextarea';
import RichViewer from '@/pages/components/RichViewer';

// Styles
import '@/pages/modals/ModalStyles.css';

// Config
import config from '@/config.js';
const serverIp = config.server_ip;
const serverPort = config.server_port;

const ModalRules = forwardRef(({selectedRules, setSelectedRules}, ref) => {
	// User/auth stuff
	const { user } = useAuth();

	const [loadingRules, setLoadingRules] = useState(false);
	const [rules, setRules] = useState([]);
	const [searchedRule, setSearchedRule] = useState('');
	const [selectedOnly, setSelectedOnly] = useState(false);

	// New rule
	const [newRule, setNewRule] = useState('');
	const newRuleRef = useRef();

	// Edit rule
	const [refRule, setRefRule] = useState({});
	const [editedRule, setEditedRule] = useState('');
	const editRuleRef = useRef();

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

	// Converts a Quill delta to plaintext
	const deltaToText = (delta) => {
		try {
			const dJson = JSON.parse(delta);
			return dJson.ops.map(op => typeof op.insert === 'string' ? op.insert : '').join('');
		}
		catch {
			return delta;
		}
	};

	// Reset fields w/in form
	const resetRulesForm = () => {
		// Reset rule stuff
		setSearchedRule('');
		setSelectedRules([]);
		setNewRule('');
		newRuleRef.current?.clear();
		setEditedRule('');
		setRefRule({});
		editRuleRef.current?.clear();
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
		.sort((a, b) => deltaToText(a.rule).localeCompare(deltaToText(b.rule)))
		.filter((rule) => {
			if (selectedOnly && !selectedRules.includes(rule.id)) return false;
			return deltaToText(rule.rule).toLowerCase().includes(searchedRule.toLowerCase());
		});

	// Reset newRule when New Rule subform cancelled
	const cancelNewRule = () => {
		document.getElementById('new-rule-form').hidden = true;
		newRuleRef.current?.clear();
		setNewRule('');
	};

	// Handle submission of newRule to db when New Rule subform submitted
	const submitNewRule = async () => {
		if (newRule == '') return;
		document.getElementById('new-rule-form').hidden = true;

		// Send info to db
		const token = localStorage.getItem('token');
		const res = await fetch(`http://${serverIp}:${serverPort}/api/rules`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify({ rule: newRule }),
		});
		const ruleJson = await res.json();
		await fetchRules();
		handleRuleChange(ruleJson.id);
		newRuleRef.current?.clear();
		setNewRule('');
	};

	// Reset editedRule when Edit Rule subform cancelled
	const cancelEditRule = async () => {
		document.getElementById('edit-rule-form').hidden = true;
		editRuleRef.current?.clear();
		setEditedRule('');
		setRefRule({});
	};

	// Handle db update based on editedRule
	const submitEditRule = async () => {
		if (editedRule == '' || editedRule === refRule.rule) return;
		document.getElementById('edit-rule-form').hidden = true;

		// Send info to db
		const token = localStorage.getItem('token');
		await fetch(`http://${serverIp}:${serverPort}/api/rules`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify({ rule: editedRule, id: refRule.id }),
		});
		fetchRules();
		editRuleRef.current?.clear();
		setEditedRule('');
		setRefRule({});
	};

	// Delete the rule currently being edited
	const deleteRule = async () => {
		const id = refRule.id;
		const conf = confirm(`Are you sure you want to delete this rule?\n\nThe rule will be deleted from ALL pharmacies.`);
		if (conf) {
			document.getElementById('edit-rule-form').hidden = true;
			editRuleRef.current?.clear();
			setEditedRule('');
			setRefRule({});
			// Remove id from selectedRules, if present
			setSelectedRules(prevSelected => prevSelected.filter(rid => rid !== id));
			// Call db to delete data
			const token = localStorage.getItem('token');
			await fetch(`http://${serverIp}:${serverPort}/api/rules?id=${id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
			});
			fetchRules();
		}
	};

	return (<>
		{/* Rules */}
		<p className="block text-sm font-light text-gray-700 mb-1">Rules</p>
		{loadingRules && <p className="mb-4 border bg-gray-100 border-gray-300 p-2 rounded">Loading rules...</p>}
		{/* Search/add bar */}
		<div className="flex mb-1 space-x-1">
			{/* Rule search bar */}
			<div className="flex w-full">
				<input
					id="rules-search-bar"
					type="text"
					placeholder="Search rules..."
					value={searchedRule}
					onChange={(e) => setSearchedRule(e.target.value)}
					className="h-10.5 w-full px-4 border border-gray-300 rounded-l-md focus:outline-cyan-500/60"
					autoComplete="off"
				/>
				<button
					id="selected-only"
					type="button"
					onClick={() => setSelectedOnly(!selectedOnly)}
					className={`${selectedOnly ? 'bg-cyan-500/60 text-white font-bold' : 'bg-gray-100 text-gray-400'} border-y border-r border-gray-300 rounded-r-md h-10.5 px-2`}
				>
					✓
				</button>
			</div>
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
				<RichTextarea 
					id="new-rule-input"
					name="new-rule-input"
					placeholder="Enter rule..."
					onChange={(e) => setNewRule(e)}
					ref={newRuleRef}
					options="slim"
				/>
				<div className="flex justify-end mt-2">
					<button tabIndex="-1" type="button" onClick={cancelNewRule} className="cursor-pointer px-4 py-2 bg-gray-800/10 text-gray-400 hover:bg-gray-800/20 rounded-l-md">Cancel</button>
					<button tabIndex="-1" type="button" onClick={submitNewRule} className="cursor-pointer px-4 py-2 bg-teal-600/60 hover:bg-teal-600/80 text-white rounded-r-md">Save</button>
				</div>
			</div>
		</div>
		{/* Edit rule form */}
		<div hidden id="edit-rule-form" className="my-1 rounded bg-orange-100 border-2 border-amber-500/60 p-2">
			<p className="block text-sm font-light text-gray-700 mb-1">Edit Rule</p>
			<div className="space-y-2">
				<RichTextarea
					id="edit-rule-input"
					name="edit-rule-input"
					onChange={(e) => setEditedRule(e)}
					ref={editRuleRef}
					options="slim"
				/>
				<div className="flex justify-end mt-2">
					{/* Delete button */}
					{ hasMinPermission(user, 'superadmin') &&
						<button tabIndex="-1" type="button" onClick={deleteRule} className="cursor-pointer mr-auto px-4 py-2 bg-red-800/20 text-red-900 hover:bg-red-800/30 rounded-md">
							<TrashIcon className="my-auto"/>
						</button>
					}
					<button tabIndex="-1" type="button" onClick={cancelEditRule} className="cursor-pointer px-4 py-2 bg-gray-800/10 text-gray-400 hover:bg-gray-800/20 rounded-l-md">Cancel</button>
					<button tabIndex="-1" type="button" onClick={submitEditRule} className="cursor-pointer px-4 py-2 bg-orange-600/60 hover:bg-orange-600/80 text-white rounded-r-md">Save</button>
				</div>
			</div>
		</div>
		{/* Rule list */}
		<div tabIndex="-1" className="resize-y mb-4 border bg-gray-100 border-gray-300 p-2 rounded h-40 w-full overflow-y-auto overflow-x-hidden space-y-2 space-x-2 scrollbar-thin">
			{filteredRules.map((rule) => {
				const isVisible = deltaToText(rule.rule).toLowerCase().includes(searchedRule.toLowerCase());
				return (
					<div 
						className={`flex justify-between w-full items-center bg-white rounded-md shadow-sm ${!isVisible ? 'hidden' : ''}`}
						key={rule.id}
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
								{/*<span className="text-sm">{rule.rule}</span>*/}
								<RichViewer deltaString={rule.rule} styling='off' />
							</div>
						</label>
						{/* Edit icon */}
						<div
							className="cursor-pointer relative group inline-block ml-2"
							onClick={() => {
								// Prevent new/edit from opening at the same time
								if (!document.getElementById('new-rule-form').hidden) return;
								editRuleRef.current.setVal(rule.rule);
								setRefRule(rule);
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