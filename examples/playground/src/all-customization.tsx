import { format as formatDate } from 'date-fns';
import * as React from 'react';
import {
	Formatter,
	JsonPrettyViewer,
	prettifyLabel,
} from 'react-json-friendly-viewer';

const data = {
	name: 'react-json-friendly-viewer',
	version: 'unknown',
	description:
		'This is a beautiful and user-friendly component to display your JSON data that provides sensible default that even your business users can understand it instantly',
	private: false,
	changes: 1000,
	dependencies: {
		react: 'latest',
	},
	createdAt: '1990-10-13T10:51:05.570Z',
	keywords: ['react', 'json viewer'],
	experiences: [
		{
			from: '2013',
			to: '2015',
			job: 'janitor',
			projects: [
				{
					venue: 'National Museum',
				},
			],
		},
	],
	referrer: null,
};

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

export const AllCustomizationExample = () => {
	const [fieldLabel, setFieldLabel] = React.useState('Props');
	const [valueLabel, setValueLabel] = React.useState('Value');
	const [customFormatter, toggleCustomFormatter] = React.useReducer(
		(o) => !o,
		true
	);
	const [mergePrimitiveArray, toggleMergePrimitiveArray] = React.useReducer(
		(o) => !o,
		false
	);
	const [customRender, toggleCustomRender] = React.useReducer((o) => !o, true);

	return (
		<div>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: 16 }}>
				<div>
					<label htmlFor="fieldLabel">fieldLabel</label>
					<input
						id="fieldLabel"
						value={fieldLabel}
						onChange={(ev) => setFieldLabel(ev.target.value)}
					/>
				</div>
				<div>
					<label htmlFor="valueLabel">valueLabel</label>
					<input
						id="valueLabel"
						value={valueLabel}
						onChange={(ev) => setValueLabel(ev.target.value)}
					/>
				</div>
				<div>
					Custom formatter
					<button type="button" onClick={toggleCustomFormatter}>
						{customFormatter ? 'True' : 'False'}
					</button>
				</div>
				<div>
					mergePrimitiveArray
					<button type="button" onClick={toggleMergePrimitiveArray}>
						{mergePrimitiveArray ? 'True' : 'False'}
					</button>
				</div>
				<div>
					Custom renderValue
					<button type="button" onClick={toggleCustomRender}>
						{customRender ? 'True' : 'False'}
					</button>
				</div>
			</div>
			<JsonPrettyViewer
				json={data}
				formatter={customFormatter ? formatter : undefined}
				fieldLabel={fieldLabel}
				valueLabel={valueLabel}
				mergePrimitiveArray={mergePrimitiveArray}
				renderValue={
					customRender
						? (value) => (
								<span
									style={{
										display: 'block',
										overflow: 'hidden',
										whiteSpace: 'nowrap',
										textOverflow: 'ellipsis',
										width: '100%',
									}}
								>
									{value}
								</span>
						  )
						: undefined
				}
			/>
		</div>
	);
};
