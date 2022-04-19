import { Category } from '../db/Category';
import { Subcategory } from '../db/Subcategory';
import { Resource } from '../db/Resource';
import { Roadmap } from '../db/Roadmap';

interface Search {
	category: Array<Category  | (Subcategory & { parent: Category })>,
	resource: Array<Resource & { parent: (Subcategory & { parent: Category })}>,
	roadmap: Roadmap[]
}

export default Search;