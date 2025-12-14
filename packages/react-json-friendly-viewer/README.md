# react-json-friendly-viewer

Beautifully display your JSON data for everyone.

[Documentations](https://react-json-friendly-viewer.netlify.app/)

```bash
npm install react-json-friendly-viewer
```

## Usage

Import the component and included CSS:

```jsx
import { JsonPrettyViewer } from 'react-json-friendly-viewer';
import 'react-json-friendly-viewer/style.css';

<JsonPrettyViewer
	json={{
		name: 'react-json-friendly-viewer',
		private: false,
		changes: 1000,
		dependencies: {
			react: 'latest',
		},
		createdAt: '1990-10-13T10:51:05.570Z',
		hobbies: ['reading', 'eating'],
		experiences: [
			{
				job: 'janitor',
				projects: [
					{
						venue: 'National Museum',
					},
				],
			},
		],
		referrer: null,
	}}
/>;
```

## Customization

### Overriding Color Tokens

You can customize the colors by overriding the CSS custom properties. The component accepts a `className` prop that you can use to target it with your custom styles:

```jsx
<JsonPrettyViewer className="my-custom-viewer" json={data} />
```

```css
/* Override default colors */
.my-custom-viewer {
	--colors-row-background-even: #ffffff;
	--colors-row-background-odd: #f8fafc;
	--colors-row-background-hover: #f1f5f9;
	--colors-heading-background: #f1f5f9;
	--colors-heading-border: #e2e8f0;
	--colors-icon-color: #94a3b8;
}
```

**Note**: Make sure to import your custom CSS after the component's CSS so your overrides take precedence:

```jsx
import 'react-json-friendly-viewer/style.css'; // Component CSS first
import './my-custom-styles.css'; // Your overrides second
```

### Dark Theme Support

To support dark theme, you can override the color tokens within a dark theme selector:

```css
/* Dark theme using media query */
@media (prefers-color-scheme: dark) {
	.my-custom-viewer {
		--colors-row-background-even: #1e293b;
		--colors-row-background-odd: #0f172a;
		--colors-row-background-hover: #334155;
		--colors-heading-background: #334155;
		--colors-heading-border: #475569;
		--colors-icon-color: #cbd5e1;
	}
}

/* Or with a class-based approach */
.dark-mode .my-custom-viewer {
	--colors-row-background-even: #1e293b;
	--colors-row-background-odd: #0f172a;
	--colors-row-background-hover: #334155;
	--colors-heading-background: #334155;
	--colors-heading-border: #475569;
	--colors-icon-color: #cbd5e1;
}
```

### Color Token Reference

| Token                      | Usage                                     | Default Light Value |
| -------------------------- | ----------------------------------------- | ------------------- |
| `row-background-even`      | Background color for even-numbered rows  | `#ffffff`           |
| `row-background-odd`       | Background color for odd-numbered rows   | `#f8fafc`           |
| `row-background-hover`     | Background color when hovering over rows | `#f1f5f9`           |
| `heading-background`       | Background color for table headings      | `#f1f5f9`           |
| `heading-border`           | Border color for table headings          | `#e2e8f0`           |
| `icon-color`               | Color for toggle icons and connectors    | `#94a3b8`           |
