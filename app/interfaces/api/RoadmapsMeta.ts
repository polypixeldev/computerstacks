import { DbRoadmap } from '../db/Roadmap';

interface RoadmapsMeta {
	numRoadmaps: number,
	roadmaps: [
		DbRoadmap[],
		DbRoadmap[],
		DbRoadmap[]
	]
}

export default RoadmapsMeta;