import Comment from './Comment';

interface DbRoadmap {
	name: string,
	description: string,
	uri: string,
	image: string,
	level: number,
};

interface Roadmap {
	name: string,
	description: string,
	uri: string,
	image: string,
	level: number,
	comments: Comment[]
};

export type {
	DbRoadmap,
	Roadmap
};