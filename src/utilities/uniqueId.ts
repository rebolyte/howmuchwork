// Generates a unique string Id using Math.random (length 10)
export const uniqueIdRandom = () =>
	Math.random()
		.toString(36)
		.substr(2);
