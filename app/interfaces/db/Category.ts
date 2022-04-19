import { Subcategory } from './Subcategory';

interface DbCategory {
	name: string,
	description: string,
	uri: string,
	level: number
};

interface Category {
	name: string,
	description: string,
	uri: string,
	level: number,
	subcategories: [
		Subcategory[],
		Subcategory[],
		Subcategory[]
	]
};

export type {
	DbCategory,
	Category
};