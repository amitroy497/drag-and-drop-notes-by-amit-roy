import { useState } from 'react';
import './App.css';
import Notes from './components/notes';

const App = () => {
	const [notes, setNotes] = useState([
		{
			id: 1,
			text: 'Hello World!',
		},
		{
			id: 2,
			text: 'This is a note',
		},
	]);

	const [note, setNote] = useState<string>('');

	return (
		<>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					gap: '5px',
					marginTop: '30px',
				}}
			>
				<input
					type='text'
					value={note}
					onChange={(e) => setNote(e.target.value)}
				/>
				<button
					onClick={() => {
						setNotes([...notes, { id: notes.length + 1, text: note }]);
						setNote('');
					}}
				>
					Add Note
				</button>
			</div>
			<Notes notes={notes} setNotes={setNotes} />
		</>
	);
};

export default App;
