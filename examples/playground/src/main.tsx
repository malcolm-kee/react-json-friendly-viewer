import { format as formatDate } from 'date-fns';
import { createRoot } from 'react-dom/client';
import {
	JsonPrettyViewer,
	Formatter,
	prettifyLabel,
} from 'react-json-friendly-viewer';
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

const formatter: Partial<Formatter> = {
	string: (value: string) => {
		return datePattern.test(value)
			? formatDate(new Date(value), 'd MMM yyyy, h:mm a')
			: value;
	},
	field: (data) =>
		data.type === 'arrayItem'
			? prettifyLabel(`${data.parentName || 'Item'} ${data.index + 1}`)
			: prettifyLabel(data.name),
};

interface CustomData {
	firstName: string;
	lastName: string;
}

const customer: CustomData = {
	firstName: 'Malcolm',
	lastName: 'Kee',
};

createRoot(document.getElementById('root') as HTMLElement).render(
	<div
		style={{
			display: 'flex',
			flexDirection: 'column',
			gap: 8,
		}}
	>
		<JsonPrettyViewer json={data} formatter={formatter} />
		<JsonPrettyViewer json={customer} />
	</div>
);
