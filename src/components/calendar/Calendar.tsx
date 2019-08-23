import { h } from 'preact';
import { observer } from 'mobx-preact';
import { getDaysInMonth } from 'date-fns/esm';
import { chunk } from 'lodash-es';

import { monthStartsOnWeekday } from '@utilities';

import './Calendar.css';

export interface CalendarProps {
	month: number;
	year: number;
	renderDay: (day: number) => h.JSX.Element;
}

export type CalendarType = (props: CalendarProps) => h.JSX.Element;

const Calendar: CalendarType = observer(({ year, month, renderDay }: CalendarProps) => {
	const numDays = getDaysInMonth(new Date(year, month, 1));
	const weekday = monthStartsOnWeekday(year, month);

	const blanks = [...Array(weekday)].map((_, idx) => <td key={'blank' + idx} class="cell"></td>);

	const cells = [...Array(numDays)].map((_, idx) => (
		<td key={'cell' + idx} class="cell">
			<span class="date">{idx + 1}</span>
			{renderDay(idx + 1)}
		</td>
	));

	const rows = chunk([...blanks, ...cells], 7);

	return (
		<table class="calendar border-collapse mx-auto" style={{ borderSpacing: 0 }}>
			<thead>
				<tr>
					<th>Sun</th>
					<th>Mon</th>
					<th>Tue</th>
					<th>Wed</th>
					<th>Thu</th>
					<th>Fri</th>
					<th>Sat</th>
				</tr>
			</thead>
			<tbody>
				{rows.map((row, idx) => (
					<tr key={idx}>{row}</tr>
				))}
			</tbody>
		</table>
	);
});

export default Calendar;
