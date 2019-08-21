import { sum } from 'lodash-es';

export const sumVals = (obj: { [key: string]: number }) => sum(Object.values(obj));
