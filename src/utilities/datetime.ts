import { format } from 'date-fns/fp';
import { eachDayOfInterval, startOfMonth, endOfMonth, isWeekend } from 'date-fns/esm';

import { dateTimeFormat } from '../constants';
import { eachWeekOfInterval } from 'date-fns';

export const formatDatetime = format(dateTimeFormat);

export const isWeekday = (date: Date) => !isWeekend(date);

export const weekdaysInMonth = (date: Date) => {
	const start = startOfMonth(date);
	const end = endOfMonth(date);

	const dates = eachDayOfInterval({ start, end });

	return dates.filter(isWeekday);
};

export const weeksInMonth = (date: Date) => {
	const start = startOfMonth(date);
	const end = endOfMonth(date);

	return eachWeekOfInterval({ start, end });
};
