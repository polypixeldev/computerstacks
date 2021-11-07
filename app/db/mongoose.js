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
});

const subcategorySchema = new mongoose.Schema({
	name: String,
	description: String,
	uri: String,
	resources: [{ type: mongoose.Schema.Types.ObjectId, ref: "resources" }],
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
});

const roadmapSchema = new mongoose.Schema({
	name: String,
	description: String,
	uri: String,
	image: String,
});

const commentSchema = new mongoose.Schema({
	content: String,
});

const categories =
	mongoose.models.categories || mongoose.model("categories", categorySchema);
const subcategories =
	mongoose.models.subcategories ||
	mongoose.model("subcategories", subcategorySchema);
const resources =
	mongoose.models.resources || mongoose.model("resources", resourceSchema);
const roadmaps =
	mongoose.models.roadmaps || mongoose.model("roadmaps", roadmapSchema);
const comments =
	mongoose.models.comments || mongoose.model("comments", commentSchema);

async function getDb() {
	await connection;

	return {
		mongoose,
		categories,
		subcategories,
		resources,
		roadmaps,
		comments,
	};
}

export default getDb;
