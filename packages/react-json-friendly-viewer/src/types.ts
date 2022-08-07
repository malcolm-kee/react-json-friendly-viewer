export type JsonObject = { [Key in string]?: JSONValue };

export type JsonArray = JSONValue[];

export type JsonPrimitive = string | number | boolean | null;

export type JSONValue = JsonPrimitive | JsonObject | JsonArray;

export type FieldData =
	| {
			type: 'prop';
			name: string;
			parentName?: string;
	  }
	| {
			type: 'arrayItem';
			index: number;
			parentName?: string;
	  };

export interface Formatter {
	boolean: (value: boolean, data: FieldData) => string;
	string: (value: string, data: FieldData) => string;
	none: (data: FieldData) => string;
	number: (value: number, data: FieldData) => string;
	prop: (name: string, parentName?: string) => string;
	arrayItem: (index: number, parentName?: string) => string;
}
