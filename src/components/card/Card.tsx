import { h, ComponentChildren } from 'preact';
import classNames from 'classnames';

export interface CardProps {
	children: ComponentChildren;
	classes?: string;
}

const Card = ({ children, classes }: CardProps) => {
	const containerClasses = classNames('bg-white', 'shadow', 'rounded', 'm-2', classes);

	return (
		<section className={containerClasses}>
			<div className="px-6 pt-4 pb-6">{children}</div>
		</section>
	);
};

export default Card;
