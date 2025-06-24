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

const ModalTrainings = forwardRef(({selectedTrainings, setSelectedTrainings}, ref) => {
	const [loadingTrainings, setLoadingTrainings] = useState(false);
	const [trainings, setTrainings] = useState([]);
	const [searchedTraining, setSearchedTraining] = useState('');

	// New training
	const [newTrainingName, setNewTrainingName] = useState('');
	const [newTrainingDesc, setNewTrainingDesc] = useState('');
	const newTrainingNameRef = useRef();
	const newTrainingDescRef = useRef();

	// Edit training
	const [editedTrainingName, setEditedTrainingName] = useState('');
	const [editedTrainingDesc, setEditedTrainingDesc] = useState('');
	const [refTraining, setRefTraining] = useState({});
	const editTrainingNameRef = useRef();
	const editTrainingDescRef = useRef();

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
		// Fetch when modal opens
		fetchTrainings();
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
	const resetTrainingsForm = () => {
		// Reset training stuff
		setSearchedTraining('');
		setSelectedTrainings([]);
		setNewTrainingName('');
		setNewTrainingDesc('');
		newTrainingNameRef.current?.clear();
		newTrainingDescRef.current?.clear();
		setEditedTrainingName('');
		setEditedTrainingDesc('');
		setRefTraining({});
		editTrainingNameRef.current?.clear();
		editTrainingDescRef.current?.clear();
	};

	useImperativeHandle(ref, () => ({
        resetTrainingsForm
    }));

	// Keep track of selected trainings during filtering
	const handleTrainingChange = (id) => {
		setSelectedTrainings(prevSelected =>
			prevSelected.includes(id)
				? prevSelected.filter(tid => tid !== id)
				: [...prevSelected, id]
		);
	};

	// Filter trainings based on user input
	const filteredTrainings = trainings
		.slice()
		.sort((a, b) => a.name.localeCompare(b.name))
		.filter((training) =>
			training.name.toLowerCase().includes(searchedTraining.toLowerCase()) ||
			deltaToText(training.description).toLowerCase().includes(searchedTraining.toLowerCase())
		);

	// Reset newTraining when New Training subform cancelled
	const cancelNewTraining = () => {
		document.getElementById('new-training-form').hidden = true;
		setNewTrainingName('');
		setNewTrainingDesc('');
		newTrainingNameRef.current?.clear();
		newTrainingDescRef.current?.clear();
	};

	// Handle submission of newTraining to db when New Training subform submitted
	const submitNewTraining = async () => {
		const nTrain = {
			name: newTrainingName?.trim(),
			description: newTrainingDesc,
		};
		if (nTrain.name === '' || nTrain.description === '') return;
		document.getElementById('new-training-form').hidden = true;
		// Send info to db
		const token = localStorage.getItem('token');
		const res = await fetch(`http://${serverIp}:${serverPort}/api/training`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify(nTrain),
		});
		const trainJson = await res.json();
		await fetchTrainings();
		handleTrainingChange(trainJson.id);
		setNewTrainingName('');
		setNewTrainingDesc('');
		newTrainingNameRef.current?.clear();
		newTrainingDescRef.current?.clear();
	}

	// Reset editedTraining when Edit Training subform cancelled
	const cancelEditTraining = async () => {
		document.getElementById('edit-training-form').hidden = true;
		setEditedTrainingName('');
		setEditedTrainingDesc('');
		setRefTraining({});
		editTrainingNameRef.current?.clear();
		editTrainingDescRef.current?.clear();
	};

	// Handle db update based on editedTraining
	const submitEditTraining = async () => {
		const eName = editedTrainingName.trim();
		const eDesc = editedTrainingDesc;
		if (eName === '' || eDesc === '') return;
		if (eName === refTraining.name && eDesc === refTraining.description) return;
		document.getElementById('edit-training-form').hidden = true;

		// Send info to db
		const token = localStorage.getItem('token');
		await fetch(`http://${serverIp}:${serverPort}/api/training`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify({name: eName, description: eDesc, id: refTraining.id}),
		});
		fetchTrainings();
		setEditedTrainingName('');
		setEditedTrainingDesc('');
		setRefTraining({});
		editTrainingNameRef.current?.clear();
		editTrainingDescRef.current?.clear();
	};

	// Delete the training currently being edited
	const deleteTraining = async () => {
		const id = refTraining.id;
		const conf = confirm(`Are you sure you want to delete this training?\n\nThe training will be deleted from ALL pharmacies.`);
		if (conf) {
			document.getElementById('edit-training-form').hidden = true;
			setEditedTrainingName('');
			setEditedTrainingDesc('');
			setRefTraining({});
			editTrainingNameRef.current?.clear();
			editTrainingDescRef.current?.clear();
			// Remove id from selectedTrainings, if present
			setSelectedTrainings(prevSelected => prevSelected.filter(tid => tid !== id));
			// Call db to delete data
			const token = localStorage.getItem('token');
			await fetch(`http://${serverIp}:${serverPort}/api/training?id=${id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
			});
			fetchTrainings();
		}
	};

	return (<>
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
				onClick={() => {
					// Prevent new/edit from opening at the same time
					if (!document.getElementById('edit-training-form').hidden) return;
					document.getElementById('new-training-form').hidden = false
				}}
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
					value={newTrainingName}
					onChange={(e) => setNewTrainingName(e.target.value)}
					className="bg-white/80 h-10.5 w-full px-4 border border-gray-300 rounded-md focus:outline-cyan-500/60"
					autoComplete="off"
				/>
				<RichTextarea 
					id="new-training-desc"
					name="new-training-desc"
					placeholder="Enter training description..."
					onChange={(e) => setNewTrainingDesc(e)}
					ref={newTrainingDescRef}
				/>
				<div className="flex justify-end mt-2">
					<button tabIndex="-1" type="button" onClick={cancelNewTraining} className="cursor-pointer px-4 py-2 bg-gray-800/10 text-gray-400 hover:bg-gray-800/20 rounded-l-md">Cancel</button>
					<button tabIndex="-1" type="button" onClick={submitNewTraining} className="cursor-pointer px-4 py-2 bg-teal-600/60 hover:bg-teal-600/80 text-white rounded-r-md">Save</button>
				</div>
			</div>
		</div>
		{/* Edit training form */}
		<div hidden id="edit-training-form" className="my-1 rounded bg-orange-100 border-2 border-amber-500/60 p-2">
			<p className="block text-sm font-light text-gray-700 mb-1">Edit Training</p>
			<div className="space-y-1">
				<input
					id="edit-training-name"
					type="text"
					placeholder="Edit training name..."
					value={editedTrainingName}
					onChange={(e) => setEditedTrainingName(e.target.value)}
					className="bg-white/80 h-10.5 w-full px-4 border border-gray-300 rounded-md focus:outline-amber-500/60"
					autoComplete="off"
				/>
				<RichTextarea 
					id="edit-training-desc"
					name="edit-training-desc"
					placeholder="Enter training description..."
					onChange={(e) => setEditedTrainingDesc(e)}
					ref={editTrainingDescRef}
				/>
				<div>
					<div className="flex justify-end mt-2">
						<button tabIndex="-1" type="button" onClick={deleteTraining} className="cursor-pointer mr-auto px-4 py-2 bg-red-800/20 text-red-900 hover:bg-red-800/30 rounded-md">
							<TrashIcon className="my-auto"/>
						</button>
						<button tabIndex="-1" type="button" onClick={cancelEditTraining} className="cursor-pointer px-4 py-2 bg-gray-800/10 text-gray-400 hover:bg-gray-800/20 rounded-l-md">Cancel</button>
						<button tabIndex="-1" type="button" onClick={submitEditTraining} className="cursor-pointer px-4 py-2 bg-orange-600/60 hover:bg-orange-600/80 text-white rounded-r-md">Save</button>
					</div>
				</div>
			</div>
		</div>
		{/* Training list */}
		<div tabIndex="-1" className="resize-y mb-4 border bg-gray-100 border-gray-300 p-2 rounded h-40 w-full overflow-y-auto overflow-x-hidden space-y-2 space-x-2 scrollbar-thin">
			{filteredTrainings.map((training) => {
				const isVisible = training.name.toLowerCase().includes(searchedTraining.toLowerCase()) || 
					deltaToText(training.description).toLowerCase().includes(searchedTraining.toLowerCase());
				return (
					<div
						className={`bg-white flex w-full items-center justify-between rounded-md shadow-sm ${!isVisible ? 'hidden' : ''}`}
						key={training.id}
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
								{/*<span className="text-sm">{training.name}</span>*/}
								<RichViewer deltaString={training.name} styling='off' />
							</div>
						</label>
						{/* Edit icon */}
						<div
							className="cursor-pointer relative group inline-block ml-2"
							onClick={() => {
								// Prevent new/edit from opening at the same time
								if (!document.getElementById('new-training-form').hidden) return;
								setEditedTrainingName(training.name);
								editTrainingDescRef.current.setVal(training.description);
								setRefTraining(training);
								document.getElementById('edit-training-form').hidden = false;
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

export default ModalTrainings;