export type JSONValue =
	| string
	| boolean
	| number
	| null
	| undefined
	| { [property: string]: JSONValue }
	| Array<JSONValue>;
