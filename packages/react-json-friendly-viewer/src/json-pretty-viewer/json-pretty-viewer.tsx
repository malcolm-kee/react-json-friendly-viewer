import { clsx as cx } from 'clsx';
import * as React from 'react';
import { position, srOnly } from '../helper.css';
import { createNamedContext } from '../lib/create-named-context';
import { noop } from '../lib/fn-lib';
import { ToggleIcon } from '../lib/toggle-icon';
import { isDefined, isNil } from '../lib/type-guard';
import { useForceUpdate } from '../lib/use-force-update';
import { formatJson, JsonNode } from '../map-json';
import { themeClass } from '../theme.css';
import type * as types from '../types';
import * as styles from './json-pretty-viewer.css';

export interface JsonPrettyViewerProps {
	json: types.JSONValue;
	formatter?: Partial<types.ValueFormatter>;
}

export const JsonPrettyViewer = ({
	json,
	formatter,
}: JsonPrettyViewerProps) => {
	const rerender = useForceUpdate();
	const [pathsToExpand, dispatch] = React.useReducer(stateReducer, []);
	const formattedJson = React.useMemo(
		() => formatJson(json, pathsToExpand, { formatter }),
		[json, pathsToExpand, formatter]
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
							FIELD
						</PrettyCell>
						<PrettyCell type="value" heading>
							VALUE
						</PrettyCell>
					</div>
					{formattedJson.map((item) => (
						<PrettyJsonNode node={item} key={item.path} />
					))}
				</div>
			</DispatchToggleContext.Provider>
		</RerenderContext.Provider>
	);
};

const PrettyJsonNode = ({ node }: { node: JsonNode }) => {
	const isStriped = node.index % 2 === 1;

	const toggle = React.useContext(DispatchToggleContext);
	const rerender = React.useContext(RerenderContext);

	React.useLayoutEffect(() => {
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

	return isDefined(node.expanded) ? (
		<div className={position.relative}>
			<button
				onClick={() => toggle(node.path)}
				className={cx(
					styles.toggleBtn,
					styles.row,
					isStriped ? styles.stripeRow.dark : styles.stripeRow.white
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
								ref={setRef}
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
						{node.value}
					</PrettyCell>
				</div>
			</button>
			{node.expanded && node.children && (
				<>
					{node.children.map((child) => (
						<PrettyJsonNode node={child} key={child.path} />
					))}
					<div
						className={cx(
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
					<div ref={setRef}>{node.label}</div>
				</PrettyCell>
				<PrettyCell
					type="value"
					className={cx(styles.offsetPaddingByLabel[node.level])}
				>
					{node.value}
				</PrettyCell>
			</div>
		</div>
	);
};

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
