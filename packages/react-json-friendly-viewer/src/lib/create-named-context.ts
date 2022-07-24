import * as React from 'react';

export function createNamedContext<ContextValueType>(
	name: string,
	defaultValue: ContextValueType
): React.Context<ContextValueType> {
	let Ctx = React.createContext<ContextValueType>(defaultValue);
	Ctx.displayName = name;
	return Ctx;
}
