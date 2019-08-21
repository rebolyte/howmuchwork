import { h, ComponentChildren } from 'preact';
import classNames from 'classnames';

import './Button.css';

export interface ButtonProps {
	children: ComponentChildren;
	onClick?: () => void;
	color?: 'white' | 'teal' | 'blue' | 'gray' | 'green' | 'orange' | 'yellow' | 'red' | 'none';
	disabled?: boolean;
	type?: 'button' | 'submit';
	classes?: string;
}

const Button = ({
	children,
	onClick,
	color = 'white',
	disabled = false,
	type = 'button',
	classes
}: ButtonProps) => {
	const btnClasses = classNames(
		'btn',
		{
			[`btn-${color}`]: color !== 'none',
			disabled: disabled
		},
		classes
	);

	const handleClick = () => {
		if (typeof onClick !== 'undefined' && !disabled) {
			onClick();
		}
	};

	return (
		<button type={type} className={btnClasses} onClick={handleClick} disabled={disabled}>
			{children}
		</button>
	);
};

export default Button;
