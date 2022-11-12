import prisma from '../db/prisma';

async function libraryResource(uri: string) {
	let data = await prisma.resource.findUnique({
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
		throw new Error(`Resource URI ${uri} does not exist`);
	}

	data = computeISOTimestamp(data);
	data.comments = data.comments.map((comment) => computeISOTimestamp(comment));

	data.comments.reverse();

	return data;
}

type DateTimestamp = {
	timestamp: Date
}

type WithISOTimestamp<T> = T & {
	timestamp: string
}

function computeISOTimestamp<Resource extends DateTimestamp>(
	resource: Resource
): WithISOTimestamp<Resource> {
	return {
		...resource,
		timestamp: resource.timestamp.toISOString(),
	}
}

export default libraryResource;
