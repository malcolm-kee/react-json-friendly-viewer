// import {
// 	createDescendantContext,
// 	Descendant,
// 	DescendantProvider,
// 	useDescendant,
// 	useDescendantsInit,
// } from '@reach/descendants';
import { noop, useForceUpdate } from '@reach/utils';
import { clsx as cx } from 'clsx';
import * as React from 'react';
import { position, srOnly } from '../helper.css';
import { createNamedContext } from '../lib/create-named-context';
import { ToggleIcon } from '../lib/toggle-icon';
import * as styles from './json-pretty-viewer.css';
// import { isDefined, isNil, isString } from '../lib/type-guard';
import { isDefined, isString } from '../lib/type-guard';
import { formatJson, JsonNode } from '../map-json';
import { themeClass } from '../theme.css';
import type * as types from '../types';

export interface JsonPrettyViewerProps {
	json: types.JSONValue;
	/**
	 * whether to format the value that fits the format 'YYYY-MM-DDThh:mm:ss.xxxZ'
	 */
	formatDate?: boolean;
}

export const JsonPrettyViewer = ({
	json,
	formatDate = false,
}: JsonPrettyViewerProps) => {
	const rerender = useForceUpdate();
	const [pathsToExpand, dispatch] = React.useReducer(stateReducer, []);
	const formattedJson = React.useMemo(
		() => formatJson(json, pathsToExpand),
		[json, pathsToExpand]
	);

	if (!json) {
		return null;
	}

	return (
		<RerenderContext.Provider value={rerender}>
			<DispatchToggleContext.Provider value={dispatch}>
				<div className={themeClass}>
					<div className={styles.flex}>
						<PrettyCell className={styles.tableHeading} type="label" heading>
							NAME
						</PrettyCell>
						<PrettyCell type="value" heading>
							VALUE
						</PrettyCell>
					</div>
					{formattedJson.map((item) => (
						<PrettyJsonNode
							node={item}
							formatDate={formatDate}
							key={item.path}
						/>
					))}
				</div>
			</DispatchToggleContext.Provider>
		</RerenderContext.Provider>
	);
};

const PrettyJsonNode = ({
	node,
	formatDate,
}: {
	node: JsonNode;
	formatDate: boolean;
}) => {
	const isStriped = node.index % 2 === 1;

	const toggle = React.useContext(DispatchToggleContext);
	// useDescendant(
	// 	{
	// 		element: currentRef.current,
	// 		isButton: isDefined(node.expanded),
	// 	},
	// 	DescendantContext
	// );
	// const [kids, setKids] = useDescendantsInit<JsonDescendant>();
	const rerender = React.useContext(RerenderContext);

	React.useLayoutEffect(() => {
		if (isDefined(node.expanded)) {
			// force rerender in order for the connector calculation to be correct
			rerender();
		}
	}, [node.expanded, rerender]);

	return isDefined(node.expanded) ? (
		<div className={position.relative}>
			<button
				onClick={() => toggle(node.path)}
				className={cx(
					styles.toggleBtn,
					'focus:pu-outline-none focus-visible:pu-shadow-outline-gray',
					isStriped ? styles.stripeRow.dark : styles.stripeRow.white,
					styles.row
				)}
				type="button"
			>
				<div className={cx(styles.flex, styles.padByLevel[node.level])}>
					<PrettyCell className={styles.toggleCell} type="label">
						<div className={styles.flexCenter}>
							<div
								className={cx(
									styles.toggleIconWrapper.default,
									node.level > 0 && styles.toggleIconWrapper.nonRoot
								)}
								ref={node.elementRef}
							>
								<span className={srOnly}>Toggle</span>
								<ToggleIcon
									icon={node.expanded ? 'minus' : 'plus'}
									width={20}
									height={20}
									className={styles.toggleIcon}
								/>
							</div>
							{node.label}
						</div>
					</PrettyCell>
					<PrettyCell
						type="value"
						className={styles.offsetPaddingByLabel[node.level]}
					>
						{formatDate ? formatIfDate(node.value) : node.value}
					</PrettyCell>
				</div>
			</button>
			{/* <DescendantProvider
				context={DescendantContext}
				items={kids}
				set={setKids}
			> */}
			{node.expanded && node.children && (
				<>
					{node.children.map((child) => (
						<PrettyJsonNode
							node={child}
							formatDate={formatDate}
							key={child.path}
						/>
					))}
					{/* <div
							className={cx(
								'pu-absolute pu-top-9 pu-pointer-events-none',
								node.level > 0 ? 'pu-left-2' : 'pu-left-0',
								styles.padByLevel[node.level]
							)}
						>
							<Connectors
								descendants={kids}
								anchor={currentRef}
								className="pu-text-lightgrey"
							/>
						</div> */}
				</>
			)}
			{/* </DescendantProvider> */}
		</div>
	) : (
		<div
			className={cx(
				styles.row,
				isStriped ? styles.stripeRow.dark : styles.stripeRow.white
			)}
		>
			<div className={cx(styles.flex, styles.padByLevel[node.level])}>
				<PrettyCell
					type="label"
					className={cx(
						node.level > 0
							? styles.nodeCell.nonFirstLevel
							: styles.nodeCell.firstLevel
					)}
				>
					<div ref={node.elementRef}>{node.label}</div>
				</PrettyCell>
				<PrettyCell
					type="value"
					className={cx(styles.offsetPaddingByLabel[node.level])}
				>
					{formatDate ? formatIfDate(node.value) : node.value}
				</PrettyCell>
			</div>
		</div>
	);
};

// const Connectors = ({
// 	descendants: nullableDescendants,
// 	className,
// 	anchor,
// }: {
// 	descendants: JsonDescendant[];
// 	className: string;
// 	anchor: React.RefObject<HTMLElement>;
// }) => {
// 	const descendants = nullableDescendants.filter(
// 		(x): x is { element: HTMLElement; index: number; isButton: boolean } =>
// 			!isNil(x.element)
// 	);

// 	if (descendants.length === 0) {
// 		return null;
// 	}

// 	const anchorRect = anchor.current && anchor.current.getBoundingClientRect();

// 	if (!anchorRect) {
// 		return null;
// 	}

// 	const kids = descendants.map((kid) => ({
// 		rect: kid.element.getBoundingClientRect(),
// 		isButton: kid.isButton,
// 	}));

// 	const lastChild = kids[kids.length - 1];
// 	const bottom = lastChild.rect.top + lastChild.rect.height / 2;

// 	const anchorBottom = anchorRect.bottom;
// 	const anchorRight = anchorRect.right;
// 	const height = bottom - anchorBottom;

// 	const width = 70;
// 	const xMid = (width - padRight - padLeft) / 2 + padLeft;
// 	const endRight = width - 4;

// 	return (
// 		<svg
// 			className={className}
// 			height={height + padBottom}
// 			viewBox={`0 0 ${width} ${height + padBottom}`}
// 			style={{
// 				top: anchorRect.height,
// 				width,
// 			}}
// 		>
// 			{kids.map((kid, i) => {
// 				if (kid === lastChild) {
// 					return null;
// 				}

// 				const y = kid.rect.top + kid.rect.height / 2 - anchorBottom;

// 				return (
// 					<line
// 						x1={xMid}
// 						y1={y}
// 						x2={
// 							endRight -
// 							(kid.isButton ? 18 : 26) +
// 							(kid.rect.left - anchorRight)
// 						}
// 						y2={y}
// 						fill="none"
// 						strokeWidth="1"
// 						stroke="currentColor"
// 						strokeDasharray="2 4"
// 						key={i}
// 					/>
// 				);
// 			})}
// 			<polyline
// 				points={`${xMid},0 ${xMid},${height} ${
// 					endRight -
// 					(lastChild.isButton ? 18 : 26) +
// 					(lastChild.rect.left - anchorRight)
// 				},${height}`}
// 				fill="none"
// 				strokeWidth="1"
// 				stroke="currentColor"
// 				strokeDasharray="2 4"
// 			/>
// 		</svg>
// 	);
// };

// const padBottom = 8;
// const padRight = 22;
// const padLeft = 28;

const stateReducer = (state: string[], pathToToggle: string) =>
	state.includes(pathToToggle)
		? state.filter((i) => i !== pathToToggle)
		: state.concat(pathToToggle);

const DispatchToggleContext = createNamedContext<React.Dispatch<string>>(
	'DispatchToggle',
	noop
);

// interface JsonDescendant extends Descendant {
// 	isButton: boolean;
// }

// const DescendantContext =
// 	createDescendantContext<JsonDescendant>('TreeDescentdant');

const RerenderContext = createNamedContext<() => void>('Rerender', noop);

const PrettyCell = (props: {
	className?: string;
	children: React.ReactNode;
	heading?: boolean;
	type: 'label' | 'value';
}) => (
	<div
		className={cx(
			styles.prettyCell,
			props.type === 'label'
				? styles.prettyCellByType.label
				: styles.prettyCellByType.nonLabel,
			props.heading
				? styles.prettyCellByType.heading
				: styles.prettyCellByType.nonHeading,
			props.className
		)}
	>
		{props.children}
	</div>
);

const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const formatIfDate = (value: string | number) =>
	// TODO
	isString(value) && datePattern.test(value) ? value : value;
