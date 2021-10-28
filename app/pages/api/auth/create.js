import prisma from "../../../prisma/client";
import bcrypt from "bcryptjs";

async function create(req, res) {
	const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

	await prisma.credentialUsers.create({
		data: {
			name: req.body.username,
			username: req.body.username,
			password: hash,
			image: null,
			email: null,
			emailVerified: null,
		},
	});

	res.status(200).end();
}

export default create;
