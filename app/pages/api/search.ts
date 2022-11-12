import { withSentry } from "@sentry/nextjs";

import prisma from '../../db/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';

async function search(req: NextApiRequest, res: NextApiResponse) {
	const categoryQuery = prisma.category.findMany({
		where: {
			OR: [
				{
					name: {
						search: typeof req.query.query === 'string' ? req.query.query : '',
					}
				},
				{
					description: {
						search: typeof req.query.query === 'string' ? req.query.query : '',
					}
				},
			]
		},
		include: {
			parent: true
		}
	});

	const resourceQuery = prisma.resource.findMany({
		where: {
			OR: [
				{
					name: {
						search: typeof req.query.query === 'string' ? req.query.query : '',
					}
				},
				{
					description: {
						search: typeof req.query.query === 'string' ? req.query.query : '',
					}
				},
				{
					author: {
						search: typeof req.query.query === 'string' ? req.query.query : '',
					}
				},
			]
		},
		include: {
			parent: true
		}
	});

	const roadmapQuery = prisma.roadmap.findMany({
		where: {
			OR: [
				{
					name: {
						search: typeof req.query.query === 'string' ? req.query.query : '',
					}
				},
				{
					description: {
						search: typeof req.query.query === 'string' ? req.query.query : '',
					}
				}
			]
		}
	});

	const [category, resource, roadmap] = await Promise.all([categoryQuery, resourceQuery, roadmapQuery]);

	res.json({
		category,
		resource,
		roadmap,
	});
}

export default withSentry(search);
