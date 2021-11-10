import mongoose from "mongoose";

const connection =
	global.mongoose ||
	mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

if (process.env.NODE_ENV !== "production") global.mongoose = connection;

const categorySchema = new mongoose.Schema({
	name: String,
	description: String,
	uri: String,
	subcategories: [
		{ type: mongoose.Schema.Types.ObjectId, ref: "subcategories" },
	],
	level: Number,
});

const subcategorySchema = new mongoose.Schema({
	name: String,
	description: String,
	uri: String,
	resources: [{ type: mongoose.Schema.Types.ObjectId, ref: "resources" }],
	level: Number,
});

const resourceSchema = new mongoose.Schema({
	name: String,
	description: String,
	uri: String,
	teamRating: Number,
	communityRating: Number,
	link: String,
	author: String,
	timestamp: Date,
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comments" }],
	level: Number,
});

const roadmapSchema = new mongoose.Schema({
	name: String,
	description: String,
	uri: String,
	image: String,
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comments" }],
	level: Number,
});

const eventSchema = new mongoose.Schema({
	name: String,
	description: String,
	uri: String,
	date: Date,
	duration: Number,
});

const commentSchema = new mongoose.Schema({
	content: String,
});

const userSchema = new mongoose.Schema(
	{
		_id: String,
		name: String,
		email: String,
		emailVerified: mongoose.Schema.Types.Mixed,
		image: String,
		favorites: Array,
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
const comments =
	mongoose.models.comments || mongoose.model("comments", commentSchema);
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
		comments,
		user,
	};
}

export default getDb;
