import { h } from 'preact';
// import { getDaysInMonth, eachWeekOfInterval } from 'date-fns/esm';

import { weeksInMonth } from '@utilities';

export interface Item {
	name: string;
	percent: number;
}

export interface Entry {
	date: Date;
	items: Item[];
}

export interface CalendarProps {
	entries: Entry[];
}

/*
entries: [
	{
		date: new Date(),
		items: [
			{ name: 'rent', percent: 0.75 }
		]
	}
]
*/

const Calendar = ({ entries }: CalendarProps) => {
	return (
		<table>
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
				{weeksInMonth(entries[0].date).map(d => (
					<tr key={d.toISOString()}>
						<td>week</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default Calendar;
