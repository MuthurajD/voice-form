import { useState } from 'react';
import './styles.css';
import VoiceForm from './wrapper/VoicerForm';

export default function App() {
	const [title, setTitle] = useState('title');
	const [description, setDescription] = useState('description');

	return (
		<VoiceForm>
			<form>
				<div>
					<input name="name" value={title} onChange={setTitle} />
					<br />
				</div>
				<div>
					<input
						name="description"
						value={description}
						onChange={setDescription}
					/>
				</div>
			</form>
		</VoiceForm>
	);
}
