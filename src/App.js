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
					<input name="name" speak={"Please tell your name"} value={title} onChange={setTitle} />
				</div>
				<div>
					<div>
						<input name="name" speak={"Please fill the description"} value={description} onChange={setDescription}></input>
					</div>
				</div>
			</form>
		</VoiceForm>
	);
}
