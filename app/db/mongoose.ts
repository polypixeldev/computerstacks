import mongoose from 'mongoose';

import User from '../interfaces/db/User';
import Event from '../interfaces/db/Event';
import Comment from '../interfaces/db/Comment';
import { DbRoadmap } from '../interfaces/db/Roadmap';
import { DbCategory } from '../interfaces/db/Category';
import { DbResource } from '../interfaces/db/Resource';
import { DbSubcategory} from '../interfaces/db/Subcategory';

if (!process.env.MONGODB_URI) {
	throw new Error("The MongoDB URI is missing from the environment variables");
}

const connection =
	global.mongoose ||
	mongoose.connect(process.env.MONGODB_URI);

if (process.env.NODE_ENV !== 'production') global.mongoose = connection;

const categorySchema = new mongoose.Schema<DbCategory>(
	{
		name: String,
		description: String,
		uri: String,
		level: Number,
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

categorySchema.virtual('subcategories', {
	ref: 'subcategories',
	localField: '_id',
	foreignField: 'parent',
});

const subcategorySchema = new mongoose.Schema<DbSubcategory>(
	{
		name: String,
		description: String,
		uri: String,
		level: Number,
		parent: { type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

subcategorySchema.virtual('resources', {
	ref: 'resources',
	localField: '_id',
	foreignField: 'parent',
});

const resourceSchema = new mongoose.Schema<DbResource>(
	{
		name: String,
		description: String,
		uri: String,
		teamRating: Number,
		communityRating: Number,
		link: String,
		author: String,
		timestamp: Date,
		level: Number,
		parent: { type: mongoose.Schema.Types.ObjectId, ref: 'subcategories' },
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

resourceSchema.virtual('comments', {
	ref: 'resourceComments',
	localField: '_id',
	foreignField: 'parent',
});

const roadmapSchema = new mongoose.Schema<DbRoadmap>(
	{
		name: String,
		description: String,
		uri: String,
		image: String,
		level: Number,
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

roadmapSchema.virtual('comments', {
	ref: 'roadmapComments',
	localField: '_id',
	foreignField: 'parent',
});

const eventSchema = new mongoose.Schema<Event>({
	name: String,
	description: String,
	uri: String,
	date: Date,
	duration: Number,
});

const resourceCommentSchema = new mongoose.Schema<Comment>({
	content: String,
	author: { type: String, ref: 'user' },
	timestamp: Date,
	parent: { type: mongoose.Schema.Types.ObjectId, ref: 'resources' },
});

const roadmapCommentSchema = new mongoose.Schema<Comment>({
	content: String,
	author: { type: String, ref: 'user' },
	timestamp: Date,
	parent: { type: mongoose.Schema.Types.ObjectId, ref: 'roadmaps' },
});

const userSchema = new mongoose.Schema<User>(
	{
		_id: String,
		name: String,
		email: String,
		emailVerified: mongoose.Schema.Types.Mixed,
		image: String,
		favorites: Array,
		roadmaps: Array,
	},
	{ collection: 'user' }
);

const categories =
	mongoose.models.categories as mongoose.Model<DbCategory> || mongoose.model<DbCategory>('categories', categorySchema);
const subcategories =
	mongoose.models.subcategories as mongoose.Model<DbSubcategory> ||
	mongoose.model<DbSubcategory>('subcategories', subcategorySchema);
const resources =
	mongoose.models.resources as mongoose.Model<DbResource> || mongoose.model<DbResource>('resources', resourceSchema);
const roadmaps =
	mongoose.models.roadmaps as mongoose.Model<DbRoadmap> || mongoose.model<DbRoadmap>('roadmaps', roadmapSchema);
const events = mongoose.models.events as mongoose.Model<Event> || mongoose.model<Event>('events', eventSchema);
const resourceComments =
	mongoose.models.resourceComments as mongoose.Model<Comment> ||
	mongoose.model<Comment>('resourceComments', resourceCommentSchema, 'resourceComments');
const roadmapComments =
	mongoose.models.roadmapComments as mongoose.Model<Comment> ||
	mongoose.model<Comment>('roadmapComments', roadmapCommentSchema, 'roadmapComments');
const user = mongoose.models.user as mongoose.Model<User> || mongoose.model<User>('user', userSchema);

async function getDb() {
	await connection;

	return {
		mongoose,
		categories,
		subcategories,
		resources,
		roadmaps,
		events,
		resourceComments,
		roadmapComments,
		user,
	};
}

export default getDb;
