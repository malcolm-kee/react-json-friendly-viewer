import * as React from 'react';
import type * as types from './types';

export interface JsonCodeViewerProps {
	json: types.JSONValue;
}

export const JsonCodeViewer = (props: JsonCodeViewerProps) => {
	return <pre>{JSON.stringify(props, null, 2)}</pre>;
};
