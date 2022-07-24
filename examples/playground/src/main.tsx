import { createRoot } from 'react-dom/client';
import { JsonPrettyViewer } from 'react-json-friendly-viewer';
import 'react-json-friendly-viewer/style.css';
import { AllCustomizationExample } from './all-customization';

interface CustomData {
	firstName: string;
	lastName: string;
	age?: number | null;
	hobbies: Array<string>;
	friends: Array<CustomData>;
}

const customer: CustomData = {
	firstName: 'Malcolm',
	lastName: 'Kee',
	age: null,
	hobbies: ['reading', 'eating'],
	friends: [
		{
			firstName: 'Pika',
			lastName: 'Chu',
			age: 30,
			hobbies: ['jumping'],
			friends: [],
		},
	],
};

createRoot(document.getElementById('root') as HTMLElement).render(
	<main
		style={{
			maxWidth: '1280px',
			margin: `0 auto`,
		}}
	>
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 8,
			}}
		>
			<h1>
				Demo of <code>react-json-friendly-viewer</code>
			</h1>
			<section>
				<h2>Minimal customization</h2>
				<JsonPrettyViewer json={customer} />
			</section>
			<section>
				<h2>All customization</h2>
				<AllCustomizationExample />
			</section>
		</div>
	</main>
);
