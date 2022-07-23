import * as React from 'react';
import type * as types from './types';

export interface JsonPrettyViewerProps {
	json: types.JSONValue;
}

export const JsonPrettyViewer = (props: JsonPrettyViewerProps) => {
	return <pre>{JSON.stringify(props, null, 2)}</pre>;
};
