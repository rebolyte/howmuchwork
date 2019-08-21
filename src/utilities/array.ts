import { clone } from 'lodash-es';

// Because `Array(len).fill({})` passes object by reference
export const fillArray = (len: number, initializer?: any) => {
	const isObj = initializer !== null && typeof initializer === 'object';
	return [...Array(len)].map(_ => (isObj ? clone(initializer) : initializer));
};
