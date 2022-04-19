import { Resource } from './Resource';
import { Types } from 'mongoose';

interface DbSubcategory {
	name: string,
	description: string,
	uri: string,
	level: number,
	parent: Types.ObjectId,
}

interface Subcategory {
	name: string,
	description: string,
	uri: string,
	level: number,
	resources: [
		Resource[],
		Resource[],
		Resource[]
	]
}

export type {
	DbSubcategory,
	Subcategory
};