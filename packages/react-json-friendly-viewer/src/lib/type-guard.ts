export const isDefined = <T>(value: T | undefined): value is T =>
	typeof value !== 'undefined';

export const isNil = (value: any): value is undefined | null =>
	typeof value === 'undefined' || value === null;

export const isString = (value: any): value is string =>
	typeof value === 'string';

export const isPrimitive = (value: any): value is string | number | boolean =>
	/^(b|st|n)/.test(typeof value);

export const isEmptyObject = (value: any): value is Record<never, never> =>
	!!value && Object.keys(value).length === 0 && value.constructor === Object;
