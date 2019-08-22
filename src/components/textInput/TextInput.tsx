import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import classNames from 'classnames';

import './TextInput.css';

export interface TextInputProps {
	value?: string;
	type?: 'text' | 'password' | 'number' | 'email';
	placeholder?: string;
	disabled?: boolean;
	classes?: string;
	onChange?: (value: string) => any;
	[x: string]: any;
}

const TextInput = ({
	value: valueProp,
	type = 'text',
	placeholder,
	onChange,
	disabled = false,
	classes,
	...restProps
}: TextInputProps) => {
	const [value, setValue] = useState(valueProp);

	useEffect(() => {
		setValue(valueProp);
	}, [valueProp]);

	const inputClasses = classNames('text-input', classes);

	const handleChange = (evt: Event) => {
		if (!disabled) {
			const target = evt.target as HTMLInputElement;
			setValue(target.value);
			onChange && onChange(target.value);
		}
	};

	return (
		<input
			type={type}
			value={value}
			placeholder={placeholder}
			onInput={handleChange}
			disabled={disabled}
			className={inputClasses}
			{...restProps}
		/>
	);
};

export default TextInput;
