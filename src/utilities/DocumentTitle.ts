import { useEffect } from 'preact/hooks';

import { usePrevious } from './usePrevious';
import { siteTitle } from '../constants';

export interface DocumentTitleProps {
	title: string;
}

export const DocumentTitle = ({ title }: DocumentTitleProps) => {
	const prevTitle = usePrevious(title);

	useEffect(() => {
		if (prevTitle !== title) {
			document.title = `${siteTitle} | ${title}`;
		}
	}, [title, prevTitle]);

	return null;
};
