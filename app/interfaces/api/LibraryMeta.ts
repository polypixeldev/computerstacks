import { DbCategory } from '../db/Category';

interface LibraryMeta {
	numResources: number,
	numSubjects: number,
	subjects: [
		DbCategory[],
		DbCategory[],
		DbCategory[]
	]
};

export default LibraryMeta;