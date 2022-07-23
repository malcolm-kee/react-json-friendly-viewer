import { style, styleVariants } from '@vanilla-extract/css';

export const srOnly = style({
	position: 'absolute',
	width: 1,
	height: 1,
	padding: 0,
	margin: `-1px`,
	overflow: 'hidden',
	clip: `rect(0, 0, 0, 0)`,
	whiteSpace: 'nowrap',
	borderWidth: 0,
});

export const position = styleVariants({
	relative: {
		position: 'relative',
	},
	absolute: {
		position: 'absolute',
	},
});
