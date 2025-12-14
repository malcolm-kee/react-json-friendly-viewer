import * as React from 'react';
import { titleCase } from 'title-case';
import { prettifyLabel } from './lib/prettify-label';
import { isEmptyObject, isNil, isPrimitive } from './lib/type-guard';
import type * as types from './types';

export type JsonNode = {
	label: string;
	value: string;
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

const isValue = (
	value: types.JSONValue
): value is string | number | boolean | null => !value || isPrimitive(value);

type JsonObjectOrArray = types.JsonObject | types.JsonArray;

export const formatJson = (
	value: types.JSONValue,
	expandedPaths: string[],
	{
		formatter: providedFormatter = {},
		mergePrimitiveArray,
	}: {
		formatter?: Partial<types.Formatter>;
		mergePrimitiveArray: boolean;
	}
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
				const label = formatter.arrayItem(index, parentName);
				const path = `${parentPath}.${label}`;

				const parsed = parseValue(item, formatter, mergePrimitiveArray, {
					type: 'arrayItem',
					index,
					parentName,
				});

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
				const label = formatter.prop(key, parentName);
				const path = `${parentPath}.${label}`;

				const parsed = parseValue(val, formatter, mergePrimitiveArray, {
					type: 'prop',
					name: key,
					parentName,
				});

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

const defaultFormatter: types.Formatter = {
	string: (value) => value,
	number: (value) => String(value),
	boolean: (value) => titleCase(String(value)),
	none: () => '-',
	prop: prettifyLabel,
	arrayItem: (index) => `Item ${index + 1}`,
};

const parseValue = (
	value: types.JSONValue | undefined,
	formatter: types.Formatter,
	mergePrimitiveArray: boolean,
	fieldData: types.FieldData
): {
	value: string;
	hasMore: boolean;
} => {
	if (isEmpty(value)) {
		return { value: formatter.none(fieldData), hasMore: false };
	}

	if (Array.isArray(value)) {
		if (value.length === 0 || value.every(isEmpty)) {
			return {
				value: formatter.none(fieldData),
				hasMore: false,
			};
		}

		if (mergePrimitiveArray && value.every(isPrimitive)) {
			return {
				value: value.map(formatValue).join(', '),
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
		case 'number':
		case 'boolean':
			return { value: formatValue(value), hasMore: false };

		case 'object':
			return { value: '', hasMore: true };

		default:
			return { value: '', hasMore: false };
	}

	function formatValue(value: string | boolean | number) {
		switch (typeof value) {
			case 'string':
				return formatter.string(value, fieldData);

			case 'number':
				return formatter.number(value, fieldData);

			case 'boolean':
				return formatter.boolean(value, fieldData);

			default:
				return '';
		}
	}
};

const isEmpty = (value: types.JSONValue | undefined): boolean =>
	isNil(value) || value === '' || isEmptyObject(value);
