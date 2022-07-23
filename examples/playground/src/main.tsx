import { createRoot } from 'react-dom/client';
import { JsonPrettyViewer } from 'react-json-friendly-viewer';

const data = {
	name: 'react-json-friendly-viewer',
	version: 'unknown',
	private: false,
	changes: 1000,
};

createRoot(document.getElementById('root') as HTMLElement).render(
	<JsonPrettyViewer json={data} />
);
