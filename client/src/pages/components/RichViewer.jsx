import React, { useEffect, useRef } from 'react';
import Quill from 'quill';

// Styles
import './ViewerStyle.css';
import 'quill/dist/quill.snow.css';

export default function DeltaViewer({ deltaString, styling }) {
	const containerRef = useRef(null);
	const quillRef = useRef(null);

	useEffect(() => {
		if (!containerRef.current) return;

		quillRef.current = new Quill(containerRef.current, {
			readOnly: true,
			theme: 'snow',
			modules: { toolbar: false },
		});

		try {
			const delta = JSON.parse(deltaString);
			quillRef.current.setContents(delta);
		}
		catch {
			quillRef.current.root.innerHTML = deltaString;
		}
	}, [deltaString]);

	return (
		<div className={`q-viewer ${styling == 'off' ? 'pt-0.5' : 'min-h-8 mb-2 bg-white px-3 rounded-md shadow-sm'}`}>
			<div ref={containerRef} className="" />
		</div>
	);
}