import { style, styleVariants } from '@vanilla-extract/css';
import { media } from '../style-const';
import { vars } from '../theme.css';

const { spacing } = vars;

export const flex = style({
	display: 'flex',
});

export const tableHeading = style({
	paddingLeft: vars.spacing[7],
});

export const row = style({
	width: '100%',
	':hover': {
		backgroundColor: vars.colors['gray-100'],
	},
});

export const stripeRow = styleVariants({
	white: {
		backgroundColor: vars.colors.white,
	},
	dark: {
		backgroundColor: vars.colors['gray-50'],
	},
});

export const toggleBtn = style([
	flex,
	{
		fontFamily: 'inherit',
		fontSize: 'inherit',
		color: 'inherit',
		cursor: 'pointer',
		alignItems: 'center',
		backgroundColor: 'inherit',
		width: '100%',
		paddingBlock: '8px',
		marginBlock: `-8px`,
	},
]);

export const toggleIconWrapper = styleVariants({
	default: {
		marginRight: spacing[1],
		marginBlock: `-1px`,
		color: vars.colors['gray-400'],
		borderRadius: '0.25rem',
		'@media': {
			[media.sm]: {
				marginRight: spacing[3],
			},
		},
	},
	nonRoot: {
		marginLeft: spacing[2],
	},
});

export const toggleIcon = style({
	display: 'block',
	transition: 'transform 150ms ease-in-out',
});

export const toggleIconExpanded = style({
	transform: 'rotate(90deg)',
});

const createPadding = (level: number) => ({
	paddingLeft: `${level * 32}px`,
});

export const padByLevel = styleVariants({
	0: createPadding(0),
	1: createPadding(1),
	2: createPadding(2),
	3: createPadding(3),
	4: createPadding(4),
	5: createPadding(5),
	6: createPadding(6),
}) as Record<number, string>;

const createOffset = (level: number) => ({
	marginLeft: `-${level * 32}px`,
});

export const offsetPaddingByLabel = styleVariants({
	0: createOffset(0),
	1: createOffset(1),
	2: createOffset(2),
	3: createOffset(3),
	4: createOffset(4),
	5: createOffset(5),
	6: createOffset(6),
}) as Record<number, string>;

export const nodeCell = styleVariants({
	firstLevel: {
		paddingLeft: spacing[7],
	},
	nonFirstLevel: {
		paddingLeft: spacing[9],
	},
});

export const toggleCell = style({
	paddingLeft: spacing[7],
	flex: 1,
});

export const prettyCellByType = styleVariants({
	label: {
		width: spacing[36],
		paddingRight: spacing[4],
		flexShrink: 0,
		'@media': {
			[media.md]: {
				width: spacing[72],
			},
		},
	},
	nonLabel: {
		flex: 1,
		paddingLeft: spacing[4],
		paddingRight: spacing[7],
		textAlign: 'right',
		'@media': {
			[media.md]: {
				textAlign: 'left',
			},
		},
	},
	heading: {
		paddingBlock: spacing[3],
		borderBottomWidth: 1,
		borderBottomColor: vars.colors['gray-200'],
		fontSize: vars.fontSize.xs,
		backgroundColor: vars.colors['gray-100'],
		fontWeight: '500',
		lineHeight: '1rem',
		letterSpacing: '0.025em',
	},
	nonHeading: {
		paddingBlock: spacing[4],
		fontSize: vars.fontSize.sm,
		lineHeight: '1.375',
		minWidth: 0,
	},
});

export const connectorWrapper = styleVariants({
	base: {
		position: 'absolute',
		top: spacing[9],
		pointerEvents: 'none',
	},
	root: {
		left: 0,
	},
	nonRoot: {
		left: spacing[2],
	},
});

export const connector = style({
	color: vars.colors['gray-400'],
});
