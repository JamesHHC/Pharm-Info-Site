// React
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';

// Content
import TrashIcon from '../../../assets/icons/TrashIcon';

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
	const [newTraining, setNewTraining] = useState({name: '', description: ''});
	const [editedTraining, setEditedTraining] = useState({ref: {}, new: {name: '', description: ''}});

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

	// Reset fields w/in form
	const resetTrainingsForm = () => {
		// Reset training stuff
		setSearchedTraining('');
		setSelectedTrainings([]);
		setNewTraining({name: '', description: ''});
		setEditedTraining({ref: {}, new: {name: '', description: ''}});
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

	// Reset editedTraining when Edit Training subform cancelled
	const cancelEditTraining = async () => {
		document.getElementById('edit-training-form').hidden = true;
		setEditedTraining({ref: {}, new: {name: '', description: ''}});
	};

	// Handle db update based on editedTraining
	const submitEditTraining = async () => {
		const ref = editedTraining.ref;
		const eName = editedTraining.new.name.trim();
		const eDesc = editedTraining.new.description.trim();
		if (eName === '' || eDesc === '') return;
		if (eName === ref.name && eDesc === ref.description) return;
		document.getElementById('edit-training-form').hidden = true;
		setEditedTraining({ref: {}, new: {name: '', description: ''}});

		// Send info to db
		await fetch(`http://${serverIp}:${serverPort}/api/training`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({name: eName, description: eDesc, id: ref.id}),
		});
		fetchTrainings();
	};

	// Delete the training currently being edited
	const deleteTraining = async () => {
		const id = editedTraining.ref.id;
		const conf = confirm(`Are you sure you want to delete this training?\n\n${editedTraining.ref.name}`);
		if (conf) {
			document.getElementById('edit-training-form').hidden = true;
			setEditedTraining({ref: {}, new: {name: '', description: ''}});
			// Remove id from selectedTrainings, if present
			setSelectedTrainings(prevSelected => prevSelected.filter(tid => tid !== id));
			// Call db to delete data
			await fetch(`http://${serverIp}:${serverPort}/api/training?id=${id}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
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
					value={editedTraining.new.name}
					onChange={(e) => setEditedTraining({ref: editedTraining.ref, new: {name: e.target.value, description: editedTraining.new.description}})}
					className="bg-white/80 h-10.5 w-full px-4 border border-gray-200 rounded-md focus:outline-amber-500/60"
					autoComplete="off"
				/>
				<textarea
					id="edit-training-desc"
					placeholder="Edit training description..."
					value={editedTraining.new.description}
					onChange={(e) => setEditedTraining({ref: editedTraining.ref, new: {name: editedTraining.new.name, description: e.target.value}})} 
					className="bg-white/80 h-15 w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-amber-500/60"
				/>
				<div>
					<div className="flex justify-end">
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
						<div
							className="cursor-pointer relative group inline-block ml-2"
							onClick={() => {
								// Prevent new/edit from opening at the same time
								if (!document.getElementById('new-training-form').hidden) return;
								setEditedTraining({ref: training, new: {name: training.name, description: training.description}});
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