import { styleVariants } from '@vanilla-extract/css';

export const iconPath = styleVariants({
	default: {
		transition: 'transform',
		transitionDuration: '150ms',
		transformOrigin: 'bottom',
	},
	plus: {
		transform: 'scaleY(1)',
	},
	minus: {
		transform: 'scaleY(0)',
	},
});
