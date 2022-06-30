import getDb from '../db/mongoose';

import { DbResource } from '../interfaces/db/Resource';

async function librarySubcategory(uri: string) {
	const { subcategories } = await getDb();

	const data = await subcategories.findOne(
		{ uri: uri },
		'name description resources'
	);

	if (!data) {
		throw new Error(`Subcategory URI ${uri} does not exist`);
	}

	const dataObj = (await data.populate<{ resources: DbResource[] }>('resources', '-_id -parent name description uri level'));

	dataObj.resources = dataObj.resources.map((resource) => ({
		name: resource.name,
		description: resource.description,
		uri: resource.uri,
		teamRating: resource.teamRating,
		communityRating: resource.communityRating,
		link: resource.link,
		author: resource.author,
		timestamp: resource.timestamp,
		level: resource.level,
		parent: resource.parent
	}));

	const level1 = dataObj.resources.filter((resource) => resource.level === 1);
	const level2 = dataObj.resources.filter((resource) => resource.level === 2);
	const level3 = dataObj.resources.filter((resource) => resource.level === 3);

	return {
		name: data.name,
		description: data.description,
		resources: [level1, level2, level3],
	};
}

export default librarySubcategory;
