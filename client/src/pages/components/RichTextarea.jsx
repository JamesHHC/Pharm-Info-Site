import React, { useEffect, useRef } from 'react';
import Quill from 'quill';

// Styles
import './TextareaStyle.css';
import 'quill/dist/quill.snow.css';

export default function RichTextarea({ id, name, label, initialValue = '', onChange }) {
	const editorRef = useRef(null);
	const quillRef = useRef(null);

	useEffect(() => {
		if (!editorRef.current || quillRef.current) return;

		quillRef.current = new Quill(editorRef.current, {
			theme: 'snow',
			placeholder: 'Type here...',
		});

		quillRef.current.root.innerHTML = initialValue;

		quillRef.current.on('text-change', () => {
			const delta = quillRef.current.getContents();
			onChange?.(delta);
		});
	}, []);

	return (
		<div className="q-textarea mb-3">
			{label && (
				<label htmlFor={id} className="block text-sm font-light text-gray-700 mb-1">
					{label}
				</label>
			)}
			<div
				id={id}
				ref={editorRef}
				className="w-full border border-gray-300 rounded-b bg-white focus:outline-cyan-500/60 scrollbar-thin"
			/>
			{/* Hidden input to hook into <form> submission */}
			<input type="hidden" name={name} value={JSON.stringify(quillRef.current?.getContents() || '')} />
		</div>
	);
}