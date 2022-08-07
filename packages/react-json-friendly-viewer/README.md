# react-json-friendly-viewer

Beautifully display your JSON data for everyone.

[Documentations](https://react-json-friendly-viewer.netlify.app/)

```bash
npm install react-json-friendly-viewer
```

## Usage

Import the component and included CSS:

```jsx
import { JsonPrettyViewer } from 'react-json-friendly-viewer';
import 'react-json-friendly-viewer/style.css';

<JsonPrettyViewer
	json={{
		name: 'react-json-friendly-viewer',
		private: false,
		changes: 1000,
		dependencies: {
			react: 'latest',
		},
		createdAt: '1990-10-13T10:51:05.570Z',
		hobbies: ['reading', 'eating'],
		experiences: [
			{
				job: 'janitor',
				projects: [
					{
						venue: 'National Museum',
					},
				],
			},
		],
		referrer: null,
	}}
/>;
```
