interface LevelArr {
	level: number;
}

export function intoLevels<T extends LevelArr>(arr: T[]) {
	return [
		arr.filter((item) => item.level === 0),
		arr.filter((item) => item.level === 1),
		arr.filter((item) => item.level === 2),
	];
}