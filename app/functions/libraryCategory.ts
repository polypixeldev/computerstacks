import prisma from '../db/prisma';

async function libraryCategory(uri: string) {
	const data = await prisma.category.findUnique({
		where: {
			uri: uri
		},
		include: {
			categoryChildren: true,
			resourceChildren: true
		}
	});

	if (!data) {
		throw new Error(`Category URI ${uri} does not exist`);
	}

	return data;
}

export default libraryCategory;
