import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Quill from 'quill';

// Styles
import './TextareaStyle.css';
import 'quill/dist/quill.snow.css';

export default function RichTextarea({ id, name, label, initialDelta = '[{\"insert\": \"\\n\"}]', onChange, ref, placeholder }) {
	const editorRef = useRef(null);
	const quillRef = useRef(null);
	const hiddenInputRef = useRef(null);

	useEffect(() => {
		if (!editorRef.current || quillRef.current) return;

		quillRef.current = new Quill(editorRef.current, {
			theme: 'snow',
			placeholder: placeholder || 'Type here...',
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

		try {
			quillRef.current.setContents(JSON.parse(initialDelta));
		}
		catch {
			quillRef.current.root.innerHTML = initialDelta;
		}

		quillRef.current.on('text-change', () => {
			const delta = quillRef.current.getContents();
			if (hiddenInputRef.current) hiddenInputRef.current.value = JSON.stringify(delta);
			if (quillRef.current.root.innerText.trim() == '') hiddenInputRef.current.value = '';
			onChange?.(quillRef.current.root.innerText.trim() == '' ? '' : JSON.stringify(delta));
		});
	}, []);

	// Expose clear() method to parent
	useImperativeHandle(ref, () => ({
		clear: () => {
			if (quillRef.current) {
				quillRef.current.setContents([{ insert: '\n' }]);
				if (hiddenInputRef.current) hiddenInputRef.current.value = "";
			}
		},
		setVal: (dString) => {
			if (quillRef.current) {
				try {
					quillRef.current.setContents(JSON.parse(dString));
				}
				catch {
					quillRef.current.root.innerHTML = dString;
				}
			}
		},
	}));

	return (
		<div className={`q-textarea ${label ? 'mb-4' : ''} overflow-visible bg-white/80`}>
			{label && (
				<p className="block text-sm font-light text-gray-700 mb-1">
					{label}
				</p>
			)}
			<div
				id={id}
				ref={editorRef}
				className="w-full border border-gray-200 rounded-b focus:outline-cyan-500/60 scrollbar-thin"
			/>
			{/* Hidden input to hook into <form> submission */}
			<input ref={hiddenInputRef} type="hidden" name={name} />
		</div>
	);
}