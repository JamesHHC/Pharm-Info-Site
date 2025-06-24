// React
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';

// Content
import TrashIcon from '../../../assets/icons/TrashIcon';
import RichTextarea from '../../components/RichTextarea';
import RichViewer from '../../components/RichViewer';

// Styles
import '../ModalStyles.css';

// Config
import config from '../../../config.js';
const serverIp = config.server_ip;
const serverPort = config.server_port;

const ModalBlurbs = forwardRef(({selectedBlurbs, setSelectedBlurbs}, ref) => {
	const [loadingBlurbs, setLoadingBlurbs] = useState(false);
	const [blurbs, setBlurbs] = useState([]);
	const [searchedBlurb, setSearchedBlurb] = useState('');
	const [socActive, setSocActive] = useState(false);
	const [fuActive, setFuActive] = useState(false);

	// New blurb
	const [newBlurbName, setNewBlurbName] = useState('');
	const [newBlurbSoc, setNewBlurbSoc] = useState(false);
	const [newBlurbFu, setNewBlurbFu] = useState(false);
	const [newBlurbDesc, setNewBlurbDesc] = useState('');
	const newBlurbDescRef = useRef();

	// Edit blurb
	const [editedBlurbName, setEditedBlurbName] = useState('');
	const [editedBlurbSoc, setEditedBlurbSoc] = useState(false);
	const [editedBlurbFu, setEditedBlurbFu] = useState(false);
	const [editedBlurbDesc, setEditedBlurbDesc] = useState('');
	const [refBlurb, setRefBlurb] = useState({});
	const editBlurbDescRef = useRef();

	// GET blurbs
	const fetchBlurbs = () => {
		setLoadingBlurbs(true);
		fetch(`http://${serverIp}:${serverPort}/api/blurbs`)
			.then((res) => res.json())
			.then((data) => setBlurbs(data))
			.catch((err) => console.error('Failed to fetch blurbs', err))
			.finally(() => setLoadingBlurbs(false));
	}

	useEffect(() => {
		// Fetch when modal opens
		fetchBlurbs();
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
	const resetBlurbsForm = () => {
		// Reset blurb stuff
		setSearchedBlurb('');
		setSelectedBlurbs([]);
		setNewBlurbName('');
		setNewBlurbSoc(false);
		setNewBlurbFu(false);
		setNewBlurbDesc('');
		newBlurbDescRef.current?.clear();
		setEditedBlurbName('');
		setEditedBlurbSoc(false);
		setEditedBlurbFu(false);
		setEditedBlurbDesc('');
		setRefBlurb({});
		editBlurbDescRef.current?.clear();
	};

	useImperativeHandle(ref, () => ({
        resetBlurbsForm
    }));

	// Keep track of selected blurbs during filtering
	const handleBlurbChange = (id) => {
		setSelectedBlurbs(prevSelected =>
			prevSelected.includes(id)
				? prevSelected.filter(bid => bid !== id)
				: [...prevSelected, id]
		);
	};

	// Filter blurbs based on user input
	const filteredBlurbs = blurbs
		.slice()
		.sort((a, b) => a.name.localeCompare(b.name))
		.filter((blurb) => {
			if (socActive && blurb.type !== 'soc' && !fuActive) return false;
			if (fuActive && blurb.type !== 'fu' && !socActive) return false;
			return blurb.name.toLowerCase().includes(searchedBlurb.toLowerCase()) ||
				deltaToText(blurb.description).toLowerCase().includes(searchedBlurb.toLowerCase());
		});

	// Reset newBlurb when New Blurb subform cancelled
	const cancelNewBlurb = () => {
		document.getElementById('new-blurb-form').hidden = true;
		setNewBlurbName('');
		setNewBlurbSoc(false);
		setNewBlurbFu(false);
		setNewBlurbDesc('');
		newBlurbDescRef.current?.clear();
	};

	// Handle submission of newBlurb to db when New Blurb subform submitted
	const submitNewBlurb = async () => {
		const nBlurb = {
			name: newBlurbName?.trim(),
			description: newBlurbDesc,
			type: newBlurbSoc ? 'soc' : newBlurbFu ? 'fu' : '',
		};
		if (nBlurb.name === ''
			|| nBlurb.description === ''
			|| nBlurb.type === '') return;

		document.getElementById('new-blurb-form').hidden = true;
		// Send info to db
		const token = localStorage.getItem('token');
		const res = await fetch(`http://${serverIp}:${serverPort}/api/blurbs`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify(nBlurb),
		});
		const blurbJson = await res.json();
		await fetchBlurbs();
		handleBlurbChange(blurbJson.id);
		setNewBlurbName('');
		setNewBlurbSoc(false);
		setNewBlurbFu(false);
		setNewBlurbDesc('');
		newBlurbDescRef.current?.clear();
	}

	// Reset editedBlurb when Edit Blurb subform cancelled
	const cancelEditBlurb = async () => {
		document.getElementById('edit-blurb-form').hidden = true;
		setEditedBlurbName('');
		setEditedBlurbSoc(false);
		setEditedBlurbFu(false);
		setEditedBlurbDesc('');
		setRefBlurb({});
		editBlurbDescRef.current?.clear();
	};

	// Handle db update based on editedBlurb
	const submitEditBlurb = async () => {
		const uBody = {
			name: editedBlurbName.trim(),
			description: editedBlurbDesc,
			type: editedBlurbSoc ? 'soc' : editedBlurbFu ? 'fu' : '',
			id: refBlurb.id,
		}
		if (uBody.name === '' 
			|| uBody.description === '' 
			|| uBody.type === '') return;
		if (uBody.name === refBlurb.name 
			&& uBody.description === refBlurb.description
			&& uBody.type === refBlurb.type) return;

		document.getElementById('edit-blurb-form').hidden = true;
		// Send info to db
		const token = localStorage.getItem('token');
		await fetch(`http://${serverIp}:${serverPort}/api/blurbs`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify(uBody),
		});
		fetchBlurbs();
		setEditedBlurbName('');
		setEditedBlurbSoc(false);
		setEditedBlurbFu(false);
		setEditedBlurbDesc('');
		setRefBlurb({});
		editBlurbDescRef.current?.clear();
	};

	// Delete the blurb currently being edited
	const deleteBlurb = async () => {
		const id = refBlurb.id;
		const conf = confirm(`Are you sure you want to delete this blurb?\n\nThe blurb will be deleted from ALL pharmacies.`);
		if (conf) {
			document.getElementById('edit-blurb-form').hidden = true;
			setEditedBlurbName('');
			setEditedBlurbSoc(false);
			setEditedBlurbFu(false);
			setEditedBlurbDesc('');
			setRefBlurb({});
			editBlurbDescRef.current?.clear();
			// Remove id from selectedBlurbs, if present
			setSelectedBlurbs(prevSelected => prevSelected.filter(tid => tid !== id));
			// Call db to delete data
			const token = localStorage.getItem('token');
			await fetch(`http://${serverIp}:${serverPort}/api/blurbs?id=${id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
			});
			fetchBlurbs();
		}
	};

	return (<>
		{/* VN Instructions (Blurb) */}
		<p className="block text-sm font-light text-gray-700 mb-1">VN Instructions</p>
		{loadingBlurbs && <p className="mb-4 border bg-gray-100 border-gray-300 p-2 rounded">Loading blurbs...</p>}
		{/* Search/add bar */}
		<div className="flex mb-1 w-full">
			{/* Blurb search bar */}
			<div className="flex w-full rounded-md">
				<button
					tabIndex='-1' type="button"
					onClick={() => { setSocActive(!socActive); if (!socActive) setFuActive(false); }}
					className={
						`cursor-pointer rounded-l-md w-12 border border-gray-300 border-r-gray-300/50 ${
							socActive ? 'bg-cyan-500/60 text-white font-bold' : 'bg-gray-100 text-gray-400'
						}`
					}
				>SOC</button>
				<button
					tabIndex='-1' type="button"
					onClick={() => { setFuActive(!fuActive); if (!fuActive) setSocActive(false); }}
					className={
						`cursor-pointer w-12 border-y border-gray-300 ${
							fuActive ? 'bg-cyan-500/60 text-white font-bold' : 'bg-gray-100 text-gray-400'
						}`
					}
				>F/U</button>
				<input
					id="blurb-search-bar"
					type="text"
					placeholder="Search blurbs..."
					value={searchedBlurb}
					onChange={(e) => setSearchedBlurb(e.target.value)}
					className="h-10.5 w-full px-4 rounded-r-md focus:outline-cyan-500/60 border border-gray-300"
					autoComplete="off"
				/>
			</div>
			{/* New blurb button */}
			<button
				tabIndex="-1"
				type="button"
				onClick={() => {
					// Prevent new/edit from opening at the same time
					if (!document.getElementById('edit-blurb-form').hidden) return;
					document.getElementById('new-blurb-form').hidden = false
				}}
				className="ml-1 text-teal-600/60 border-2 border-teal-600/60 rounded-md hover:border-teal-600/0 hover:text-white hover:bg-teal-600/60"
			>
				<span className="px-4 py-2 font-medium">Add</span>
			</button>
		</div>
		{/* New blurb form */}
		<div hidden id="new-blurb-form" className="my-1 rounded bg-sky-100 border-2 border-cyan-500/60 p-2">
			<p className="block text-sm font-light text-gray-700 mb-1">New Blurb</p>
			<div className="space-y-1">
				<input
					id="new-blurb-name"
					type="text"
					placeholder="Enter blurb name..."
					value={newBlurbName}
					onChange={(e) => setNewBlurbName(e.target.value)}
					className="bg-white/80 h-10.5 w-full px-4 border border-gray-300 rounded-md focus:outline-cyan-500/60"
					autoComplete="off"
				/>
				{/* Blurb type */}
				<div className="flex items-center">
					{/* SOC */}
					<input
						checked={newBlurbSoc}
						onChange={(e) => {
							setNewBlurbSoc(e.target.checked);
							if (e.target.checked && newBlurbFu) setNewBlurbFu(false);
						}}
						tabIndex="-1" id="new_type_soc" name="new_type_soc" type="checkbox"
						className="appearance-none custom-chk transition border-1 border-gray-300 w-5 h-5 focus:outline-cyan-500/60 checked:border-0 bg-white/80 checked:bg-cyan-800 rounded-full"
					/>
					<label htmlFor="new_type_soc" className="block font-light text-sm p-2 items">Start of Care</label>
					{/* Follow-Up */}
					<input
						checked={newBlurbFu}
						onChange={(e) => {
							setNewBlurbFu(e.target.checked);
							if (newBlurbSoc && e.target.checked) setNewBlurbSoc(false);
						}}
						tabIndex="-1" id="new_type_fu" name="new_type_fu" type="checkbox"
						className="ml-2 appearance-none custom-chk transition border-1 border-gray-300 w-5 h-5 focus:outline-cyan-500/60 checked:border-0 bg-white/80 checked:bg-cyan-800 rounded-full"
					/>
					<label htmlFor="new_type_fu" className="block font-light text-sm p-2 items">Follow-Up</label>
				</div>
				<RichTextarea 
					id="new-blurb-desc"
					name="new-blurb-desc"
					placeholder="Enter blurb description..."
					onChange={(e) => setNewBlurbDesc(e)}
					ref={newBlurbDescRef}
				/>
				<div className="flex justify-end mt-2">
					<button tabIndex="-1" type="button" onClick={cancelNewBlurb} className="cursor-pointer px-4 py-2 bg-gray-800/10 text-gray-400 hover:bg-gray-800/20 rounded-l-md">Cancel</button>
					<button tabIndex="-1" type="button" onClick={submitNewBlurb} className="cursor-pointer px-4 py-2 bg-teal-600/60 hover:bg-teal-600/80 text-white rounded-r-md">Save</button>
				</div>
			</div>
		</div>
		{/* Edit blurb form */}
		<div hidden id="edit-blurb-form" className="my-1 rounded bg-orange-100 border-2 border-amber-500/60 p-2">
			<p className="block text-sm font-light text-gray-700 mb-1">Edit Blurb</p>
			<div className="space-y-1">
				<input
					id="edit-blurb-name"
					type="text"
					placeholder="Edit blurb name..."
					value={editedBlurbName}
					onChange={(e) => setEditedBlurbName(e.target.value)}
					className="bg-white/80 h-10.5 w-full px-4 border border-gray-300 rounded-md focus:outline-amber-500/60"
					autoComplete="off"
				/>
				{/* Blurb type */}
				<div className="flex items-center">
					{/* SOC */}
					<input
						checked={editedBlurbSoc}
						onChange={(e) => {
							setEditedBlurbSoc(e.target.checked);
							if (e.target.checked && editedBlurbFu) setEditedBlurbFu(false);
						}}
						tabIndex="-1" id="edit_type_soc" name="edit_type_soc" type="checkbox"
						className="appearance-none custom-chk transition border-1 border-gray-300 w-5 h-5 focus:outline-cyan-500/60 checked:border-0 bg-white/80 checked:bg-cyan-800 rounded-full"
					/>
					<label htmlFor="edit_type_soc" className="block font-light text-sm p-2 items">Start of Care</label>
					{/* Follow-Up */}
					<input
						checked={editedBlurbFu}
						onChange={(e) => {
							setEditedBlurbFu(e.target.checked);
							if (editedBlurbSoc && e.target.checked) setEditedBlurbSoc(false);
						}}
						tabIndex="-1" id="edit_type_fu" name="edit_type_fu" type="checkbox"
						className="ml-2 appearance-none custom-chk transition border-1 border-gray-300 w-5 h-5 focus:outline-cyan-500/60 checked:border-0 bg-white/80 checked:bg-cyan-800 rounded-full"
					/>
					<label htmlFor="edit_type_fu" className="block font-light text-sm p-2 items">Follow-Up</label>
				</div>
				<RichTextarea 
					id="edit-blurb-desc"
					name="edit-blurb-desc"
					placeholder="Enter blurb description..."
					onChange={(e) => setEditedBlurbDesc(e)}
					ref={editBlurbDescRef}
				/>
				<div>
					<div className="flex justify-end mt-2">
						<button tabIndex="-1" type="button" onClick={deleteBlurb} className="cursor-pointer mr-auto px-4 py-2 bg-red-800/20 text-red-900 hover:bg-red-800/30 rounded-md">
							<TrashIcon className="my-auto"/>
						</button>
						<button tabIndex="-1" type="button" onClick={cancelEditBlurb} className="cursor-pointer px-4 py-2 bg-gray-800/10 text-gray-400 hover:bg-gray-800/20 rounded-l-md">Cancel</button>
						<button tabIndex="-1" type="button" onClick={submitEditBlurb} className="cursor-pointer px-4 py-2 bg-orange-600/60 hover:bg-orange-600/80 text-white rounded-r-md">Save</button>
					</div>
				</div>
			</div>
		</div>
		{/* Blurb list */}
		<div tabIndex="-1" className="resize-y mb-4 border bg-gray-100 border-gray-300 p-2 rounded h-40 w-full overflow-y-auto overflow-x-hidden space-y-2 space-x-2 scrollbar-thin">
			{filteredBlurbs.map((blurb) => {
				const isVisible = blurb.name.toLowerCase().includes(searchedBlurb.toLowerCase()) || 
					deltaToText(blurb.description).toLowerCase().includes(searchedBlurb.toLowerCase());
				return (
					<div
						className={`bg-white flex w-full items-center justify-between rounded-md shadow-sm ${!isVisible ? 'hidden' : ''}`}
						key={blurb.id}
					>
						<label htmlFor={`blurb_${blurb.id}`} className="w-full p-2">
							<div className="flex items-center">
								<input
									tabIndex="-1"
									type="checkbox"
									id={`blurb_${blurb.id}`}
									name="blurb"
									value={blurb.id}
									checked={selectedBlurbs.includes(blurb.id)}
									onChange={() => handleBlurbChange(blurb.id)}
									className="appearance-none flex-none custom-chk transition border-1 border-gray-300 mr-2 w-5 h-5 focus:outline-cyan-500/60 checked:border-0 checked:bg-cyan-800 pointer-events-none rounded-full"
								/>
								{/*<span className="text-sm">{blurb.name}</span>*/}
								<RichViewer deltaString={blurb.name} styling='off' />
							</div>
						</label>
						{/* Edit icon */}
						<div
							className="cursor-pointer relative group inline-block ml-2"
							onClick={() => {
								// Prevent new/edit from opening at the same time
								if (!document.getElementById('new-blurb-form').hidden) return;
								setEditedBlurbName(blurb.name);
								blurb.type === 'soc' ? setEditedBlurbSoc(true) : setEditedBlurbFu(true);
								editBlurbDescRef.current.setVal(blurb.description);
								setRefBlurb(blurb);
								document.getElementById('edit-blurb-form').hidden = false;
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

export default ModalBlurbs;