import * as React from 'react';
import { titleCase } from 'title-case';
import { prettifyLabel } from './lib/prettify-label';
import { isEmptyObject, isNil, isPrimitive } from './lib/type-guard';
import { Formatter, JSONValue, JsonArray, JsonObject } from './types';

export type JsonNode = {
	label: string;
	value: string | number;
	index: number;
	level: number;
	path: string;
	elementRef: React.MutableRefObject<{
		element: HTMLDivElement;
		isButton: boolean;
	} | null>;
	expanded?: boolean;
	children?: Array<JsonNode>;
};

const isValue = (value: JSONValue): value is string | number | boolean | null =>
	!value || isPrimitive(value);

type JsonObjectOrArray = JsonObject | JsonArray;

export const formatJson = (
	value: JSONValue,
	expandedPaths: string[],
	{
		formatter: providedFormatter = {},
	}: {
		formatter?: Partial<Formatter>;
	} = {}
): JsonNode[] => {
	if (isValue(value)) {
		return [];
	}

	const formatter = {
		...defaultFormatter,
		...providedFormatter,
	};

	const result: JsonNode[] = [];
	let itemIndex = 0;

	function collect(
		output: JsonNode[],
		value: JsonObjectOrArray,
		parentPath: string,
		level: number,
		parentName?: string
	) {
		if (Array.isArray(value)) {
			value.forEach((item, index) => {
				const label = formatter.field({ type: 'arrayItem', index, parentName });
				const path = `${parentPath}.${label}`;

				const parsed = parseValue(item, formatter);

				if (parsed.hasMore) {
					const expanded = expandedPaths.includes(path);
					const children: JsonNode[] = [];
					output.push({
						label,
						path,
						value: parsed.value,
						index: itemIndex++,
						children,
						expanded,
						level,
						elementRef: React.createRef(),
					});
					if (expanded) {
						collect(
							children,
							item as JsonObjectOrArray,
							path,
							level + 1,
							parentName
						);
					}
				} else {
					output.push({
						label,
						value: parsed.value,
						index: itemIndex++,
						path,
						level,
						elementRef: React.createRef(),
					});
				}
			});
		} else {
			Object.entries(value).forEach(([key, val]) => {
				const label = formatter.field({
					type: 'prop',
					name: key,
					parentName,
				});
				const path = `${parentPath}.${label}`;

				const parsed = parseValue(val, formatter);

				if (parsed.hasMore) {
					const expanded = expandedPaths.includes(path);
					const children: JsonNode[] = [];
					output.push({
						label,
						value: parsed.value,
						index: itemIndex++,
						path,
						children,
						expanded,
						level,
						elementRef: React.createRef(),
					});
					if (expanded) {
						collect(children, val as JsonObjectOrArray, path, level + 1, key);
					}
				} else {
					output.push({
						label,
						value: parsed.value,
						index: itemIndex++,
						path,
						level,
						elementRef: React.createRef(),
					});
				}
			});
		}
	}

	collect(result, value, '', 0);

	return result;
};

const defaultFormatter: Formatter = {
	string: (value) => value,
	number: (value) => String(value),
	boolean: (value) => titleCase(String(value)),
	field: (data) =>
		data.type === 'prop' ? prettifyLabel(data.name) : `Item ${data.index + 1}`,
};

const parseValue = (
	value: JSONValue | undefined,
	formatter: Formatter
): {
	value: string | number;
	hasMore: boolean;
} => {
	if (isEmpty(value)) {
		return { value: '-', hasMore: false };
	}

	if (Array.isArray(value)) {
		if (value.length === 0 || value.every(isEmpty)) {
			return {
				value: '-',
				hasMore: false,
			};
		}

		if (value.every(isPrimitive)) {
			return {
				value: value
					.map((item) =>
						typeof item === 'boolean' ? titleCase(String(item)) : item
					)
					.join(', '),
				hasMore: false,
			};
		}

		return {
			value: '',
			hasMore: true,
		};
	}

	switch (typeof value) {
		case 'string':
			return { value: formatter.string(value), hasMore: false };

		case 'number':
			return { value: formatter.number(value), hasMore: false };

		case 'boolean':
			return { value: formatter.boolean(value), hasMore: false };

		case 'object':
			return { value: '', hasMore: true };

		default:
			return { value: '', hasMore: false };
	}
};

const isEmpty = (value: JSONValue | undefined) =>
	isNil(value) || value === '' || isEmptyObject(value);
