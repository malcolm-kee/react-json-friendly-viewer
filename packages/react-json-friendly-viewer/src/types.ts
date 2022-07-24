export type JSONValue =
	| string
	| boolean
	| number
	| null
	| undefined
	| { [property: string]: JSONValue }
	| Array<JSONValue>;

export interface ValueFormatter {
	boolean: (value: boolean) => string;
	string: (value: string) => string;
	number: (value: number) => string;
}
