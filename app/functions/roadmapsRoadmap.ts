import prisma from '../db/prisma';
import { computeISOTimestamp } from '../util/computeISOTimestamp';

async function roadmapsRoadmap(uri: string) {
	let data = await prisma.roadmap.findUnique({
		where: {
			uri: uri
		},
		include: {
			comments: {
				include: {
					author: true
				}
			}
		}
	});

	if (!data) {
		throw new Error(`Roadmap URI ${uri} not found`);
	}

	data.comments = data.comments.map((comment) => computeISOTimestamp(comment));
	data.comments.reverse();

	return data;
}

export default roadmapsRoadmap;
