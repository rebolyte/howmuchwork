import { h, JSX } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import classNames from 'classnames';

import './Select.css';

export const selectDefaultVal = 'DEFAULT';

interface Option {
	name: string;
	value: string;
}

export interface SelectBaseProps {
	options: Option[];
	value?: string;
	defaultValue?: string;
	disabled?: boolean;
	classes?: string;
	[x: string]: any;
}

export interface SelectProps extends SelectBaseProps {
	onChange?: (value: string) => any;
}

export interface SelectRawProps extends SelectBaseProps {
	onChange?: (evt: Event) => any;
	rawChangeEvent: boolean;
}

interface SelectOverload {
	(props: SelectProps): JSX.Element;
	(props: SelectRawProps): JSX.Element;
}

const DLSelect: SelectOverload = (props: SelectProps | SelectRawProps) => {
	const {
		options,
		onChange: onChangeVal,
		value: valueProp,
		defaultValue,
		disabled = false,
		classes,
		rawChangeEvent: _,
		...restProps
	} = props as SelectProps;
	const { onChange: onChangeEvt, rawChangeEvent } = props as SelectRawProps;

	const [value, setValue] = useState(valueProp);

	useEffect(() => {
		setValue(valueProp);
	}, [valueProp]);

	const handleChange = (evt: Event) => {
		if (!disabled) {
			const target = evt.target as HTMLSelectElement;
			const val = target.value;
			setValue(val);
			if (rawChangeEvent) {
				onChangeEvt && onChangeEvt(evt);
			} else {
				onChangeVal && onChangeVal(val);
			}
		}
	};

	const containerClasses = classNames('inline-block', 'relative', classes);

	return (
		<div className={containerClasses}>
			<select
				value={value}
				onChange={handleChange}
				disabled={disabled}
				className="select-input"
				{...restProps}
			>
				{defaultValue !== undefined && (
					<option value={selectDefaultVal} disabled>
						{defaultValue}
					</option>
				)}
				{options.map(({ name, value }) => (
					<option key={value} value={value}>
						{name}
					</option>
				))}
			</select>
			<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
				<svg
					className="fill-current h-4 w-4"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
				>
					<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
				</svg>
			</div>
		</div>
	);
};

export default DLSelect;
