import { format as formatDate } from 'date-fns';
import { createRoot } from 'react-dom/client';
import { JsonPrettyViewer, ValueFormatter } from 'react-json-friendly-viewer';
import 'react-json-friendly-viewer/style.css';

const data = {
	name: 'react-json-friendly-viewer',
	version: 'unknown',
	private: false,
	changes: 1000,
	dependencies: {
		react: 'latest',
	},
	createdAt: '1990-10-13T10:51:05.570Z',
	hobbies: ['reading', 'eating'],
	experiences: [
		{
			from: '2013',
			to: '2015',
			job: 'janitor',
		},
	],
};

const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const formatter: Partial<ValueFormatter> = {
	string: (value: string) => {
		return datePattern.test(value)
			? formatDate(new Date(value), 'd MMM yyyy, h:mm a')
			: value;
	},
};

createRoot(document.getElementById('root') as HTMLElement).render(
	<JsonPrettyViewer json={data} formatter={formatter} />
);
