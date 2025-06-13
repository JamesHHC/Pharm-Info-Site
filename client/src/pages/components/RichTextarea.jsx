import React, { useEffect, useRef } from 'react';
import Quill from 'quill';

// Styles
import './TextareaStyle.css';
import 'quill/dist/quill.snow.css';

export default function RichTextarea({ id, name, label, initialValue = '', onChange }) {
	const editorRef = useRef(null);
	const quillRef = useRef(null);
	const hiddenInputRef = useRef(null);

	useEffect(() => {
		if (!editorRef.current || quillRef.current) return;

		quillRef.current = new Quill(editorRef.current, {
			theme: 'snow',
			placeholder: 'Type here...',
			modules: {
				toolbar: [
					[{ size: [ 'small', false, 'large' ] }],
					[
						'bold',
						'italic',
						'underline',
						{ 'color': [] },
						{ 'background': [] },
					],
					[ 'link', 'clean' ],
				],
			},
		});

		quillRef.current.root.innerHTML = initialValue;

		quillRef.current.on('text-change', () => {
			const delta = quillRef.current.getContents();
			if (hiddenInputRef.current) hiddenInputRef.current.value = JSON.stringify(delta);
			onChange?.(delta);
		});
	}, []);

	return (
		<div className="q-textarea mb-4 overflow-visible">
			{label && (
				<p className="block text-sm font-light text-gray-700 mb-1">
					{label}
				</p>
			)}
			<div
				id={id}
				ref={editorRef}
				className="w-full border border-gray-300 rounded-b bg-white focus:outline-cyan-500/60 scrollbar-thin"
			/>
			{/* Hidden input to hook into <form> submission */}
			<input ref={hiddenInputRef} type="hidden" name={name} />
		</div>
	);
}