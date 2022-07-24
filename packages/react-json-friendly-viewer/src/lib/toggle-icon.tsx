import { clsx } from 'clsx';
import * as React from 'react';
import { iconPath } from './toggle-icon.css';

export const ToggleIcon = React.forwardRef<
	SVGSVGElement,
	React.ComponentPropsWithoutRef<'svg'> & {
		icon?: 'plus' | 'minus';
	}
>(function ToggleIcon({ icon, ...props }, ref) {
	return (
		<svg
			fill="none"
			viewBox="0 0 24 24"
			width={24}
			height={24}
			stroke="currentColor"
			aria-hidden
			{...props}
			ref={ref}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M18 12H6"
			/>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				className={clsx(
					iconPath.default,
					icon === 'plus' ? iconPath.plus : iconPath.minus
				)}
				d="M12 6V18"
			/>
		</svg>
	);
});
