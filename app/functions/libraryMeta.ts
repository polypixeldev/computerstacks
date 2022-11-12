import prisma from '../db/prisma';

async function libraryMeta() {
	const numResourcesQuery = prisma.resource.count()
	const numCategoriesQuery = prisma.category.count()
	const categoriesQuery = prisma.category.findMany()
	const [numResources, numCategories, categories] = await Promise.all([numResourcesQuery, numCategoriesQuery, categoriesQuery]);

	return {
		numResources,
		numCategories,
		categories
	};
}

export default libraryMeta;
