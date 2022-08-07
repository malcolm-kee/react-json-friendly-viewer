## Basic Example

Pass any javascript json object to `json` props and it will be rendered in a user-friendly table.

```tsx
import { JsonPrettyViewer } from 'react-json-friendly-viewer';

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

## Array Example

Array can be displayed as well.

```tsx
import { JsonPrettyViewer } from 'react-json-friendly-viewer';

<JsonPrettyViewer
	json={[
		{
			firstName: 'Malcolm',
			isTired: true,
		},
		{
			firstName: 'Steve',
			isTired: false,
		},
	]}
/>;
```

## Playground

Use the panel at the bottom to tweak the props.

```tsx
import { usePropsEditor } from 'react-showroom/client';

const Demo = () => {
	const propsEditor = usePropsEditor();

	return (
		<JsonPrettyViewer
			{...propsEditor.props}
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
		/>
	);
};

<Demo />;
```

## Custom Format

Pass `formatter` props to change how values are displayed.

```tsx
import { format as formatDate } from 'date-fns';
import {
	JsonPrettyViewer,
	Formatter,
	prettifyLabel,
} from 'react-json-friendly-viewer';

const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const formatter: Partial<Formatter> = {
	string: (value: string) => {
		return datePattern.test(value)
			? formatDate(new Date(value), 'd MMM yyyy, h:mm a')
			: value;
	},
	arrayItem: (index, parentName) =>
		prettifyLabel(`${parentName || 'Item'} ${index + 1}`),
	none: () => `(None)`,
};

<JsonPrettyViewer
	formatter={formatter}
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
