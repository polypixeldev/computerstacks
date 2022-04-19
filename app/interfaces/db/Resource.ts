import { Types } from 'mongoose';

import Comment from './Comment';

interface DbResource {
	name: string,
	description: string,
	uri: string,
	teamRating: number,
	communityRating: number,
	link: string,
	author: string,
	timestamp: Date,
	level: number,
	parent: Types.ObjectId,
}

interface Resource {
	name: string,
	description: string,
	uri: string,
	teamRating: number,
	communityRating: number,
	link: string,
	author: string,
	timestamp: Date,
	level: number,
	comments: Comment[]
}

export type {
	DbResource,
	Resource
};