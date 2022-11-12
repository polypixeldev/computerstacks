import prisma from '../db/prisma';

async function roadmapsMeta() {
	const roadmapCountQuery = prisma.roadmap.count();
	const roadmapsQuery = prisma.roadmap.findMany();
	const [numRoadmaps, roadmaps] = await Promise.all([roadmapCountQuery, roadmapsQuery]);

	return {
		numRoadmaps,
		roadmaps
	};
}

export default roadmapsMeta;
