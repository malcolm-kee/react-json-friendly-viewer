import { useId } from '@radix-ui/react-id';
import { clsx } from 'clsx';
import * as React from 'react';
import { position, srOnly } from '../helper.css';
import { createNamedContext } from '../lib/create-named-context';
import { noop } from '../lib/fn-lib';
import { isDefined, isNil } from '../lib/type-guard';
import { useForceUpdate } from '../lib/use-force-update';
import { formatJson, JsonNode } from '../map-json';
import { themeClass } from '../theme.css';
import type * as types from '../types';
import * as styles from './json-pretty-viewer.css';

export interface JsonPrettyViewerProps
	extends React.ComponentPropsWithoutRef<'div'> {
	json: any;
	formatter?: Partial<types.Formatter>;
	fieldLabel?: string;
	valueLabel?: string;
	mergePrimitiveArray?: boolean;
	renderValue?: (value: string) => React.ReactNode;
	renderToggleIcon?: (expanded: boolean) => React.ReactNode;
}

/**
 * Displays any json data in user-friendly table.
 *
 * Unspecified props will be spreaded to the underlying `div` element.
 */
export const JsonPrettyViewer = ({
	json,
	formatter,
	mergePrimitiveArray = true,
	renderValue = (val) => val,
	fieldLabel = 'FIELD',
	valueLabel = 'VALUE',
	renderToggleIcon = defaultRenderToggleIcon,
	...divProps
}: JsonPrettyViewerProps) => {
	const ensuredId = useId(divProps.id);
	const rerender = useForceUpdate();
	const [pathsToExpand, dispatch] = React.useReducer(stateReducer, []);
	const formattedJson = React.useMemo(
		() => formatJson(json, pathsToExpand, { formatter, mergePrimitiveArray }),
		[json, pathsToExpand, formatter, mergePrimitiveArray]
	);

	if (!json) {
		return null;
	}

	return (
		<RerenderContext.Provider value={rerender}>
			<DispatchToggleContext.Provider value={dispatch}>
				<div
					role="grid"
					{...divProps}
					className={clsx(themeClass, divProps.className)}
				>
					<div role="rowgroup">
						<div role="row" className={styles.flex}>
							<PrettyCell className={styles.tableHeading} type="label" heading>
								{fieldLabel}
							</PrettyCell>
							<PrettyCell type="value" heading>
								{valueLabel}
							</PrettyCell>
						</div>
					</div>
					<div role="rowgroup">
						{formattedJson.map((item) => (
							<PrettyJsonNode
								node={item}
								rootId={ensuredId}
								renderValue={renderValue}
								renderToggleIcon={renderToggleIcon}
								key={item.path}
							/>
						))}
					</div>
				</div>
			</DispatchToggleContext.Provider>
		</RerenderContext.Provider>
	);
};

const PrettyJsonNode = ({
	node,
	rootId,
	renderValue,
	renderToggleIcon,
	...divProps
}: {
	node: JsonNode;
	rootId: string;
	renderValue: (value: string) => React.ReactNode;
	renderToggleIcon: (expanded: boolean) => React.ReactNode;
} & React.ComponentPropsWithoutRef<'div'>) => {
	const isStriped = node.index % 2 === 1;

	const toggle = React.useContext(DispatchToggleContext);
	const rerender = React.useContext(RerenderContext);

	React.useEffect(() => {
		if (isDefined(node.expanded)) {
			// force rerender in order for the connector calculation to be correct
			rerender();
		}
	}, [node.expanded, rerender]);

	const setRef = (el: HTMLDivElement | null) => {
		node.elementRef.current = el && {
			element: el,
			isButton: isDefined(node.expanded),
		};
	};

	const sectionId = isDefined(node.expanded) ? `${rootId}.${node.path}` : '';

	return isDefined(node.expanded) ? (
		<div {...divProps} className={position.relative}>
			<div
				role="row"
				className={clsx(
					styles.row,
					isStriped ? styles.stripeRow.dark : styles.stripeRow.white
				)}
			>
				<div className={clsx(styles.flex, styles.padByLevel[node.level])}>
					<PrettyCell
						className={styles.toggleCell}
						type="label"
						aria-colspan={2}
					>
						<button
							onClick={() => toggle(node.path)}
							className={styles.toggleBtn}
							type="button"
							aria-expanded={node.expanded}
							aria-controls={sectionId}
						>
							<div
								className={clsx(
									styles.toggleIconWrapper.default,
									node.level > 0 && styles.toggleIconWrapper.nonRoot
								)}
								ref={setRef}
							>
								<span className={srOnly}>Toggle</span>
								<svg
									className={clsx(
										styles.toggleIcon,
										node.expanded && styles.toggleIconExpanded
									)}
									width={20}
									height={20}
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							{node.label}
						</button>
					</PrettyCell>
				</div>
			</div>
			{node.expanded && node.children && (
				<>
					{node.children.map((child) => (
						<PrettyJsonNode
							node={child}
							rootId={rootId}
							id={sectionId}
							renderValue={renderValue}
							renderToggleIcon={renderToggleIcon}
							key={child.path}
						/>
					))}
					<div
						className={clsx(
							styles.connectorWrapper.base,
							node.level > 0
								? styles.connectorWrapper.nonRoot
								: styles.connectorWrapper.root,
							styles.padByLevel[node.level]
						)}
					>
						<Connectors node={node} className={styles.connector} />
					</div>
				</>
			)}
		</div>
	) : (
		<div
			{...divProps}
			className={clsx(
				styles.row,
				isStriped ? styles.stripeRow.dark : styles.stripeRow.white
			)}
			role="row"
		>
			<div className={clsx(styles.flex, styles.padByLevel[node.level])}>
				<PrettyCell
					type="label"
					className={clsx(
						node.level > 0
							? styles.nodeCell.nonFirstLevel
							: styles.nodeCell.firstLevel
					)}
				>
					<div ref={setRef}>{node.label}</div>
				</PrettyCell>
				<PrettyCell
					type="value"
					className={clsx(styles.offsetPaddingByLabel[node.level])}
				>
					{renderValue(node.value)}
				</PrettyCell>
			</div>
		</div>
	);
};

const defaultRenderToggleIcon = (expanded: boolean) => (
	<ToggleIcon expanded={expanded} />
);

const ToggleIcon = ({ expanded }: { expanded: boolean }) => (
	<svg
		className={clsx(styles.toggleIcon, expanded && styles.toggleIconExpanded)}
		width={20}
		height={20}
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path
			fillRule="evenodd"
			d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
			clipRule="evenodd"
		/>
	</svg>
);

const Connectors = ({
	node,
	className,
}: {
	node: JsonNode;
	className: string;
}) => {
	const descendants = collectChildElements(node.children || []);

	if (descendants.length === 0) {
		return null;
	}

	const anchorRect =
		node.elementRef.current &&
		node.elementRef.current.element.getBoundingClientRect();

	if (!anchorRect) {
		return null;
	}

	const kids = descendants.map((kid) => ({
		rect: kid.element.getBoundingClientRect(),
		isButton: kid.isButton,
	}));

	const lastChild = kids[kids.length - 1];
	const bottom = lastChild.rect.top + lastChild.rect.height / 2;

	const anchorBottom = anchorRect.bottom;
	const anchorRight = anchorRect.right;
	const height = bottom - anchorBottom;

	const width = 70;
	const xMid = (width - padRight - padLeft) / 2 + padLeft;
	const endRight = width - 4;

	return (
		<svg
			className={className}
			height={height + padBottom}
			viewBox={`0 0 ${width} ${height + padBottom}`}
			style={{
				top: anchorRect.height,
				width,
			}}
			aria-hidden
		>
			{kids.map((kid, i) => {
				if (kid === lastChild) {
					return null;
				}

				const y = kid.rect.top + kid.rect.height / 2 - anchorBottom;

				return (
					<line
						x1={xMid}
						y1={y}
						x2={
							endRight -
							(kid.isButton ? 18 : 26) +
							(kid.rect.left - anchorRight)
						}
						y2={y}
						fill="none"
						strokeWidth="1"
						stroke="currentColor"
						strokeDasharray="2 4"
						key={i}
					/>
				);
			})}
			<polyline
				points={`${xMid},0 ${xMid},${height} ${
					endRight -
					(lastChild.isButton ? 18 : 26) +
					(lastChild.rect.left - anchorRight)
				},${height}`}
				fill="none"
				strokeWidth="1"
				stroke="currentColor"
				strokeDasharray="2 4"
			/>
		</svg>
	);
};

const collectChildElements = (nodes: JsonNode[]) => {
	const result: Array<{
		element: HTMLDivElement;
		isButton: boolean;
	}> = [];

	nodes.forEach((node) => {
		if (!isNil(node.elementRef.current)) {
			result.push(node.elementRef.current);
		}
	});

	return result;
};

const padBottom = 8;
const padRight = 22;
const padLeft = 28;

const stateReducer = (state: string[], pathToToggle: string) =>
	state.includes(pathToToggle)
		? state.filter((i) => i !== pathToToggle)
		: state.concat(pathToToggle);

const DispatchToggleContext = createNamedContext<React.Dispatch<string>>(
	'DispatchToggle',
	noop
);

const RerenderContext = createNamedContext<() => void>('Rerender', noop);

const PrettyCell = ({
	children,
	heading,
	type,
	...props
}: {
	children: React.ReactNode;
	heading?: boolean;
	type: 'label' | 'value';
} & React.ComponentPropsWithoutRef<'div'>) => (
	<div
		role={heading ? 'columnheader' : 'cell'}
		{...props}
		className={clsx(
			type === 'label'
				? styles.prettyCellByType.label
				: styles.prettyCellByType.nonLabel,
			heading
				? styles.prettyCellByType.heading
				: styles.prettyCellByType.nonHeading,
			props.className
		)}
	>
		{children}
	</div>
);
