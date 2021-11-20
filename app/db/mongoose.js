import mongoose from "mongoose";

const connection =
	global.mongoose ||
	mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

if (process.env.NODE_ENV !== "production") global.mongoose = connection;

const categorySchema = new mongoose.Schema(
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

categorySchema.virtual("subcategories", {
	ref: "subcategories",
	localField: "_id",
	foreignField: "parent",
});

const subcategorySchema = new mongoose.Schema(
	{
		name: String,
		description: String,
		uri: String,
		level: Number,
		parent: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

subcategorySchema.virtual("resources", {
	ref: "resources",
	localField: "_id",
	foreignField: "parent",
});

const resourceSchema = new mongoose.Schema(
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
		parent: { type: mongoose.Schema.Types.ObjectId, ref: "subcategories" },
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

resourceSchema.virtual("comments", {
	ref: "resourceComments",
	localField: "_id",
	foreignField: "parent",
});

const roadmapSchema = new mongoose.Schema(
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

roadmapSchema.virtual("comments", {
	ref: "roadmapComments",
	localField: "_id",
	foreignField: "parent",
});

const eventSchema = new mongoose.Schema({
	name: String,
	description: String,
	uri: String,
	date: Date,
	duration: Number,
});

const resourceCommentSchema = new mongoose.Schema({
	content: String,
	author: { type: String, ref: "user" },
	timestamp: Date,
	parent: { type: mongoose.Schema.Types.ObjectId, ref: "resources" },
});

const roadmapCommentSchema = new mongoose.Schema({
	content: String,
	author: { type: String, ref: "user" },
	timestamp: Date,
	parent: { type: mongoose.Schema.Types.ObjectId, ref: "roadmaps" },
});

const userSchema = new mongoose.Schema(
	{
		_id: String,
		name: String,
		email: String,
		emailVerified: mongoose.Schema.Types.Mixed,
		image: String,
		favorites: Array,
		roadmaps: Array,
	},
	{ collection: "user" }
);

const categories =
	mongoose.models.categories || mongoose.model("categories", categorySchema);
const subcategories =
	mongoose.models.subcategories ||
	mongoose.model("subcategories", subcategorySchema);
const resources =
	mongoose.models.resources || mongoose.model("resources", resourceSchema);
const roadmaps =
	mongoose.models.roadmaps || mongoose.model("roadmaps", roadmapSchema);
const events = mongoose.models.events || mongoose.model("events", eventSchema);
const resourceComments =
	mongoose.models.resourceComments ||
	mongoose.model("resourceComments", resourceCommentSchema, "resourceComments");
const roadmapComments =
	mongoose.models.roadmapComments ||
	mongoose.model("roadmapComments", roadmapCommentSchema, "roadmapComments");
const user = mongoose.models.user || mongoose.model("user", userSchema);

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
