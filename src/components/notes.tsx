/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRef, useEffect, useRef } from 'react';
import Note from './note';

type NotesProps = {
	notes: Array<{
		id: number;
		text: string;
		position?: { x: number; y: number };
	}>;
	setNotes: (
		notes: Array<{
			id: number;
			text: string;
			position?: { x: number; y: number };
		}>
	) => void;
};

type NoteType = {
	id: number;
	text: string;
	position?: {
		x: number;
		y: number;
	};
};
const Notes = ({ notes, setNotes }: NotesProps) => {
	useEffect(() => {
		const savedNotes =
			JSON.parse(localStorage.getItem('notes') as string) || [];

		const updatedNotes = notes.map((note: NoteType) => {
			const savedNote = savedNotes.find((n: NoteType) => n.id === note.id);
			if (savedNote) {
				return { ...note, position: savedNote.position };
			} else {
				const position = determineNewPosition();
				return { ...note, position };
			}
		});

		setNotes(updatedNotes);
		localStorage.setItem('notes', JSON.stringify(updatedNotes));
	}, [notes, notes.length, setNotes]);

	const noteRefs = useRef<any>([]);

	const determineNewPosition = () => {
		const maxX = window.innerWidth - 250;
		const maxY = window.innerHeight - 250;

		return {
			x: Math.floor(Math.random() * maxX),
			y: Math.floor(Math.random() * maxY),
		};
	};

	const handleDragStart = (note: NoteType, e: any) => {
		const { id } = note;
		const noteRef = noteRefs?.current[id]?.current;
		const rect = noteRef.getBoundingClientRect();
		const offsetX = e.clientX - rect.left;
		const offsetY = e.clientY - rect.top;

		const startPos = note.position;

		const handleMouseMove = (e: any) => {
			const newX = e.clientX - offsetX;
			const newY = e.clientY - offsetY;

			noteRef.style.left = `${newX}px`;
			noteRef.style.top = `${newY}px`;
		};

		const handleMouseUp = () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);

			const finalRect = noteRef.getBoundingClientRect();
			const newPosition = { x: finalRect.left, y: finalRect.top };

			if (checkForOverlap(id)) {
				// check for overlap
				noteRef.style.left = `${startPos?.x}px`;
				noteRef.style.top = `${startPos?.y}px`;
			} else {
				updateNotePosition(id, newPosition);
			}
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};

	const checkForOverlap = (id: number) => {
		const currentNoteRef = noteRefs.current[id].current;
		const currentRect = currentNoteRef.getBoundingClientRect();

		return notes.some((note: NoteType) => {
			if (note.id === id) return false;

			const otherNoteRef = noteRefs.current[note.id].current;
			const otherRect = otherNoteRef.getBoundingClientRect();

			const overlap = !(
				currentRect.right < otherRect.left ||
				currentRect.left > otherRect.right ||
				currentRect.bottom < otherRect.top ||
				currentRect.top > otherRect.bottom
			);

			return overlap;
		});
	};

	const updateNotePosition = (id: number, newPosition: any) => {
		const updatedNotes = notes.map((note: NoteType) =>
			note.id === id ? { ...note, position: newPosition } : note
		);
		setNotes(updatedNotes);
		localStorage.setItem('notes', JSON.stringify(updatedNotes));
	};

	return (
		<div>
			{notes.map((note: NoteType) => {
				return (
					<Note
						key={note.id}
						ref={
							noteRefs.current[note.id]
								? noteRefs.current[note.id]
								: (noteRefs.current[note.id] = createRef())
						}
						initialPos={note.position}
						content={note.text}
						onMouseDown={(e: any) => handleDragStart(note, e)}
					/>
				);
			})}
		</div>
	);
};

export default Notes;
