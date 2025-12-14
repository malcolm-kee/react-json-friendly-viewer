import {
	createGlobalThemeContract,
	createTheme,
	globalStyle,
} from '@vanilla-extract/css';

const colors = {
	'row-background-even': '#ffffff',
	'row-background-odd': '#f8fafc',
	'row-background-hover': '#f1f5f9',
	'heading-background': '#f1f5f9',
	'heading-border': '#e2e8f0',
	'icon-color': '#94a3b8',
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

const themeTokens = {
	colors,
	spacing,
	fontSize,
};

// Create theme contract with predictable variable names (no hashing)
// Using createGlobalThemeContract with a mapper function to generate constant variable names
export const vars = createGlobalThemeContract(themeTokens, (_value, path) =>
	path.join('-')
);

// Create a scoped theme with a hashed class name but predictable variable names
// The hashed class provides scoping while the constant variable names allow user overrides
export const themeClass = createTheme(vars, themeTokens);

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
