import { withSentry } from "@sentry/nextjs";

import getDb from '../../db/mongoose';

import type { NextApiRequest, NextApiResponse } from 'next';

async function search(req: NextApiRequest, res: NextApiResponse) {
	const { categories, subcategories, resources, roadmaps } = await getDb();

	const queryRegex = { $regex: req.query.query, $options: 'i' };

	let queries = [
		categories.find({
			$or: [{ name: queryRegex }, { description: queryRegex }],
		}),
		subcategories.find({
			$or: [{ name: queryRegex }, { description: queryRegex }],
		}),
		resources.find({
			$or: [
				{ name: queryRegex },
				{ description: queryRegex },
				{ author: queryRegex },
			],
		}),
		roadmaps.find({ $or: [{ name: queryRegex }, { description: queryRegex }] }),
	];

	const [category, subcategory, resource, roadmap] = await Promise.all(queries);

	let populateQueries = [
		Promise.all(subcategory.map((subcat) => subcat.populate('parent'))),
		Promise.all(
			resource.map((res) =>
				res.populate({
					path: 'parent',
					populate: {
						path: 'parent',
					},
				})
			)
		),
	];

	await Promise.all(populateQueries);

	res.json({
		category: [...category, ...subcategory],
		resource,
		roadmap,
	});
}

export default withSentry(search);
