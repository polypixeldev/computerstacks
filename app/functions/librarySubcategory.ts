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

	const dataObj = (await data.populate<{ resources: DbResource[] }>('resources', '-_id name description uri teamRating communityRating link author timestamp level parent '));

	const resources = dataObj.resources.map((resource) => ({
		name: resource.name,
		description: resource.description,
		uri: resource.uri,
		teamRating: resource.teamRating,
		communityRating: resource.communityRating,
		link: resource.link,
		author: resource.author,
		timestamp: resource.timestamp.toISOString(),
		level: resource.level
	}));

	const newDataObj = {
		name: dataObj.name,
		description: dataObj.description,
		uri: dataObj.uri,
		level: dataObj.level,
		parent: dataObj.parent,
		resources
	}

	const level1 = newDataObj.resources.filter((resource) => resource.level === 1);
	const level2 = newDataObj.resources.filter((resource) => resource.level === 2);
	const level3 = newDataObj.resources.filter((resource) => resource.level === 3);

	return {
		name: data.name,
		description: data.description,
		resources: [level1, level2, level3],
	};
}

export default librarySubcategory;
