import { createTheme, globalStyle } from '@vanilla-extract/css';

const colors = {
	white: '#ffffff',
	'gray-50': '#f8fafc',
	'gray-100': '#f1f5f9',
	'gray-200': '#e2e8f0',
	'gray-400': '#94a3b8',
	'gray-500': '#64748b',
};

const spacing = {
	1: '4px',
	2: '8px',
	3: '12px',
	4: '16px',
	5: '20px',
	6: '24px',
	7: '28px',
	9: '36px',
	36: '144px',
	72: '288px',
};

const fontSize = {
	xs: '0.75rem',
	sm: '0.875rem',
	base: '1rem',
	lg: '1.125rem',
	xl: '1.25rem',
	'2xl': '1.5rem',
	'3xl': '1.875rem',
	'4xl': '2.25rem',
};

export const [themeClass, vars] = createTheme({
	colors,
	spacing,
	fontSize,
});

globalStyle(`${themeClass} *`, {
	boxSizing: 'border-box',
	borderWidth: 0,
	padding: 0,
	margin: 0,
});

globalStyle(`${themeClass} button`, {
	WebkitAppearance: 'button',
	appearance: 'button',
	backgroundImage: 'none',
});
