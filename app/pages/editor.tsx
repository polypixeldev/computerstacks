import { useState } from 'react';

import { trpc } from '../util/trpc';

function Editor() {
	const [category, setCategory] = useState('');
	const [path, setPath] = useState<string[]>([]);

	const [newCategoryName, setNewCategoryName] = useState('');
	const [newCategoryUri, setNewCategoryUri] = useState('');
	const [newCategoryDesc, setNewCategoryDesc] = useState('');
	const [newCategoryLevel, setNewCategoryLevel] = useState(0);

	const [newResourceName, setNewResourceName] = useState('');
	const [newResourceUri, setNewResourceUri] = useState('');
	const [newResourceDesc, setNewResourceDesc] = useState('');
	const [newResourceLink, setNewResourceLink] = useState('');
	const [newResourceAuthor, setNewResourceAuthor] = useState('');
	const [newResourceLevel, setNewResourceLevel] = useState(0);

	const catQuery = trpc.library.category.useQuery(
		{
			uri: path[path.length - 1],
		},
		{
			enabled: path.length > 0,
		}
	);
	const rootQuery = trpc.library.rootCategories.useQuery(undefined, {
		enabled: path.length === 0,
	});

	const currentCats =
		path.length > 0 ? catQuery.data?.categoryChildren : rootQuery.data;

	const addCategoryMutation = trpc.library.addCategory.useMutation();
	const addResourceMutation = trpc.library.addResource.useMutation();

	return (
		<main>
			<section className="centered flex w-screen flex-col items-center justify-start gap-10 bg-gray-1 px-10">
				<h2 className="text-5xl">Library Editor</h2>
				<div className=" flex w-full flex-col items-center justify-start gap-4 rounded-md bg-gray-2 p-4">
					<p className="text-3xl">Category</p>
					<div className="flex w-full flex-row items-center justify-center gap-3 text-2xl">
						<p>/</p>
						{path.map((p) => (
							<div
								key={p}
								className="flex flex-row items-center justify-start gap-3"
							>
								<p
									className="hover:text-red-600 hover:line-through"
									onClick={() => {
										setPath((pa) => pa.slice(0, pa.indexOf(p)));
									}}
								>
									{p}
								</p>
								<p>/</p>
							</div>
						))}
						<div className="flex flex-row items-center gap-2">
							<select
								className="text-md rounded-md bg-white p-2 text-black"
								value={category}
								onChange={(e) => setCategory(e.target.value)}
							>
								<option value="CHOOSE">Choose a category...</option>
								{currentCats?.map((cat) => (
									<option key={cat.uri} value={cat.uri}>
										{cat.name}
									</option>
								))}
							</select>
							<button
								className="flex aspect-square h-8 flex-row items-center justify-center rounded-full bg-blue-700 text-center"
								onClick={() => {
									if (category && category !== 'CHOOSE') {
										setPath((p) => [...p, category]);
										setCategory('');
									}
								}}
							>
								+
							</button>
						</div>
					</div>
				</div>
				<div className="flex w-full flex-row items-start justify-center gap-10">
					<div className="flex flex-grow flex-col items-center justify-start gap-5 rounded-md bg-gray-2 p-4">
						<p className="text-3xl">Add Category</p>
						<div className="flex w-3/4 flex-col items-start justify-start">
							<label className="text-lg">Name</label>
							<input
								type="text"
								value={newCategoryName}
								onChange={(e) => setNewCategoryName(e.target.value)}
								className="w-full rounded-md p-2 text-lg text-black"
							/>
						</div>
						<div className="flex w-3/4 flex-col items-start justify-start">
							<label className="text-lg">URI</label>
							<input
								type="text"
								value={newCategoryUri}
								onChange={(e) =>
									setNewCategoryUri(
										e.target.value.toLowerCase().replaceAll(' ', '-')
									)
								}
								className="w-full rounded-md p-2 text-lg text-black"
							/>
						</div>
						<div className="flex w-3/4 flex-col items-start justify-start">
							<label className="text-lg">Description</label>
							<textarea
								value={newCategoryDesc}
								onChange={(e) => setNewCategoryDesc(e.target.value)}
								className="w-full rounded-md p-2 text-lg text-black"
							/>
						</div>
						<div className="flex w-3/4 flex-col items-start justify-start">
							<label className="text-lg">Level</label>
							<input
								type="number"
								min={0}
								max={2}
								value={newCategoryLevel}
								onChange={(e) => setNewCategoryLevel(Number(e.target.value))}
								className="w-full rounded-md p-2 text-lg text-black"
							/>
						</div>
						<button
							className="rounded-md bg-blue-700 py-2 px-5 text-2xl"
							onClick={() => {
								if (newCategoryName && newCategoryUri && newCategoryDesc) {
									addCategoryMutation
										.mutateAsync({
											name: newCategoryName,
											uri: newCategoryUri,
											description: newCategoryDesc,
											level: newCategoryLevel,
											parentUri: path[path.length - 1] ?? undefined,
										})
										.then(() => {
											rootQuery.refetch();
											catQuery.refetch();
										});

									setNewCategoryName('');
									setNewCategoryUri('');
									setNewCategoryDesc('');
									setNewCategoryLevel(0);
								}
							}}
						>
							Add
						</button>
					</div>
					<div className="flex flex-grow flex-col items-center justify-start gap-5 rounded-md bg-gray-2 p-4">
						<p className="text-3xl">Add Resource</p>
						<div className="flex w-3/4 flex-col items-start justify-start">
							<label className="text-lg">Name</label>
							<input
								type="text"
								value={newResourceName}
								onChange={(e) => setNewResourceName(e.target.value)}
								className="w-full rounded-md p-2 text-lg text-black"
							/>
						</div>
						<div className="flex w-3/4 flex-col items-start justify-start">
							<label className="text-lg">URI</label>
							<input
								type="text"
								value={newResourceUri}
								onChange={(e) =>
									setNewResourceUri(
										e.target.value.toLowerCase().replaceAll(' ', '-')
									)
								}
								className="w-full rounded-md p-2 text-lg text-black"
							/>
						</div>
						<div className="flex w-3/4 flex-col items-start justify-start">
							<label className="text-lg">Description</label>
							<textarea
								value={newResourceDesc}
								onChange={(e) => setNewResourceDesc(e.target.value)}
								className="w-full rounded-md p-2 text-lg text-black"
							/>
						</div>
						<div className="flex w-3/4 flex-col items-start justify-start">
							<label className="text-lg">Link</label>
							<input
								type="url"
								value={newResourceLink}
								onChange={(e) => setNewResourceLink(e.target.value)}
								className="w-full rounded-md p-2 text-lg text-black"
							/>
						</div>
						<div className="flex w-3/4 flex-col items-start justify-start">
							<label className="text-lg">Author</label>
							<input
								type="text"
								value={newResourceAuthor}
								onChange={(e) => setNewResourceAuthor(e.target.value)}
								className="w-full rounded-md p-2 text-lg text-black"
							/>
						</div>
						<div className="flex w-3/4 flex-col items-start justify-start">
							<label className="text-lg">Level</label>
							<input
								type="number"
								min={0}
								max={2}
								value={newResourceLevel}
								onChange={(e) => setNewResourceLevel(Number(e.target.value))}
								className="w-full rounded-md p-2 text-lg text-black"
							/>
						</div>
						<button
							className="rounded-md bg-blue-700 py-2 px-5 text-2xl"
							onClick={() => {
								if (
									newResourceName &&
									newResourceUri &&
									newResourceDesc &&
									newResourceLink &&
									newResourceAuthor &&
									path[path.length - 1]
								) {
									addResourceMutation
										.mutateAsync({
											name: newResourceName,
											uri: newResourceUri,
											description: newResourceDesc,
											link: newResourceLink,
											author: newResourceAuthor,
											level: newResourceLevel,
											parentUri: path[path.length - 1],
										})
										.then(() => {
											rootQuery.refetch();
											catQuery.refetch();
										});

									setNewResourceName('');
									setNewResourceUri('');
									setNewResourceDesc('');
									setNewResourceLink('');
									setNewResourceAuthor('');
									setNewResourceLevel(0);
								}
							}}
						>
							Add
						</button>
					</div>
				</div>
			</section>
		</main>
	);
}

export default Editor;
