import { titleCase } from 'title-case';
import { isEmptyObject, isNil, isPrimitive } from './lib/type-guard';
import { JSONValue, ValueFormatter } from './types';
import * as React from 'react';

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

const isValue = (
	value: JSONValue
): value is string | number | boolean | undefined | null =>
	!value || isPrimitive(value);

type JsonObjectOrArray =
	| {
			[prop: string]: JSONValue;
	  }
	| JSONValue[];

export const formatJson = (
	value: JSONValue,
	expandedPaths: string[],
	{
		formatter: providedFormatter = {},
	}: {
		formatter?: Partial<ValueFormatter>;
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
		level: number
	) {
		if (Array.isArray(value)) {
			value.forEach((item, index) => {
				const label = `Item ${index + 1}`;
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
						collect(children, item as JsonObjectOrArray, path, level + 1);
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
				const label = prettifyLabel(key);
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
						collect(children, val as JsonObjectOrArray, path, level + 1);
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

/**
 * @see https://stackoverflow.com/a/35953318/7150387
 */
export const prettifyLabel = (camelCaseText: string): string => {
	if (!camelCaseText || typeof camelCaseText !== 'string') {
		return camelCaseText;
	}

	if (camelCaseText === 'id' || camelCaseText === '_id') {
		return 'ID';
	}

	const sentence = camelCaseText
		.replace(/([a-z])([A-Z][a-z])/g, '$1 $2') // "To Get YourGEDIn TimeASong About The26ABCs IsOf The Essence ButAPersonalIDCard For User456In Room26AContainingABC26Times IsNot AsEasy As123ForC3POOrR2D2Or2R2D"
		.replace(/([A-Z][a-z])([A-Z])/g, '$1 $2') // "To Get YourGEDIn TimeASong About The26ABCs Is Of The Essence ButAPersonalIDCard For User456In Room26AContainingABC26Times Is Not As Easy As123ForC3POOr R2D2Or2R2D"
		.replace(/([a-z])([A-Z]+[a-z])/g, '$1 $2') // "To Get Your GEDIn Time ASong About The26ABCs Is Of The Essence But APersonal IDCard For User456In Room26AContainingABC26Times Is Not As Easy As123ForC3POOr R2D2Or2R2D"
		.replace(/([A-Z]+)([A-Z][a-z][a-z])/g, '$1 $2') // "To Get Your GEDIn Time A Song About The26ABCs Is Of The Essence But A Personal ID Card For User456In Room26A ContainingABC26Times Is Not As Easy As123ForC3POOr R2D2Or2R2D"
		.replace(/([a-z]+)([A-Z0-9]+)/g, '$1 $2') // "To Get Your GEDIn Time A Song About The 26ABCs Is Of The Essence But A Personal ID Card For User 456In Room 26A Containing ABC26Times Is Not As Easy As 123For C3POOr R2D2Or 2R2D"

		// Note: the next regex includes a special case to exclude plurals of acronyms, e.g. "ABCs"
		.replace(/([A-Z]+)([A-Z][a-rt-z][a-z]*)/g, '$1 $2') // "To Get Your GED In Time A Song About The 26ABCs Is Of The Essence But A Personal ID Card For User 456In Room 26A Containing ABC26Times Is Not As Easy As 123For C3PO Or R2D2Or 2R2D"
		.replace(/([0-9])([A-Z][a-z]+)/g, '$1 $2') // "To Get Your GED In Time A Song About The 26ABCs Is Of The Essence But A Personal ID Card For User 456In Room 26A Containing ABC 26Times Is Not As Easy As 123For C3PO Or R2D2Or 2R2D"

		// Note: the next two regexes use {2,} instead of + to add space on phrases like Room26A and 26ABCs but not on phrases like R2D2 and C3PO"
		.replace(/([A-Z]{2,})([0-9]{2,})/g, '$1 $2') // "To Get Your GED In Time A Song About The 26ABCs Is Of The Essence But A Personal ID Card For User 456 In Room 26A Containing ABC 26 Times Is Not As Easy As 123 For C3PO Or R2D2 Or 2R2D"
		.replace(/([0-9]{2,})([A-Z]{2,})/g, '$1 $2')
		.trim();
	return (
		sentence &&
		sentence.charAt(0).toUpperCase() + sentence.substring(1).toLowerCase()
	);
};

const defaultFormatter: ValueFormatter = {
	string: (value) => value,
	number: (value) => String(value),
	boolean: (value) => titleCase(String(value)),
};

const parseValue = (
	value: JSONValue,
	formatter: ValueFormatter
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

const isEmpty = (value: JSONValue) =>
	isNil(value) || value === '' || isEmptyObject(value);
