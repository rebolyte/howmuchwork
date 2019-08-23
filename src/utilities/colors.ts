import { range } from 'lodash-es';

export type ColorProperties = 'text' | 'bg';

// TODO: not used yet

export class ColorFountain {
	color: string;
	property: ColorProperties = 'bg';
	start = 400;
	end = 800;

	private colors: string[] = [];

	constructor(color: string, property?: ColorProperties, start?: number, end?: number) {
		this.color = color;
		if (property !== undefined) {
			this.property = property;
		}
		if (start !== undefined) {
			this.start = start;
		}
		if (end !== undefined) {
			this.end = end;
		}

		this.colors = range(this.start, this.end + 1, 100).map(num =>
			this.genClass(this.property, this.color, num)
		);
	}

	private genClass(property: ColorProperties, color: string, num: number) {
		return `${property}-${color}-${num}`;
	}

	next() {
		const color = this.colors.shift();
		this.colors.push(color as string);
		return color;
	}
}
