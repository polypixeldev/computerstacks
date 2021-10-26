import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

async function create(req, res) {
	const client = await clientPromise;
	const users = client.db("project").collection("users");

	const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

	await users.insertOne({
		name: req.body.username,
		username: req.body.username,
		password: hash,
		image: null,
		email: null,
		emailVerified: null,
	});

	res.status(200).end();
}

export default create;
