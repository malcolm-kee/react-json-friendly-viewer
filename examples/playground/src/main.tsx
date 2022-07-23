import { createRoot } from 'react-dom/client';
import { JsonPrettyViewer } from 'react-json-friendly-viewer';
import 'react-json-friendly-viewer/style.css';

const data = {
	name: 'react-json-friendly-viewer',
	version: 'unknown',
	private: false,
	changes: 1000,
	dependencies: {
		react: 'latest',
	},
	hobbies: ['reading', 'eating'],
	experiences: [
		{
			from: '2013',
			to: '2015',
			job: 'janitor',
		},
	],
};

createRoot(document.getElementById('root') as HTMLElement).render(
	<JsonPrettyViewer json={data} />
);
