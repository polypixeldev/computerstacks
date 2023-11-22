import { useState, useEffect } from 'react';

import { trpc } from '../util/trpc';

function Editor() {
	const [category, setCategory] = useState('');
	const [path, setPath] = useState<string[]>([]);

	const [newCategoryName, setNewCategoryName] = useState('');
	const [newCategoryUri, setNewCategoryUri] = useState('');
	const [newCategoryDesc, setNewCategoryDesc] = useState('');
	const [newCategoryLevel, setNewCategoryLevel] = useState(0);

	const [categoryName, setCategoryName] = useState('');
	const [categoryDesc, setCategoryDesc] = useState('');
	const [categoryLevel, setCategoryLevel] = useState(0);

	const [newResourceName, setNewResourceName] = useState('');
	const [newResourceUri, setNewResourceUri] = useState('');
	const [newResourceDesc, setNewResourceDesc] = useState('');
	const [newResourceLink, setNewResourceLink] = useState('');
	const [newResourceAuthor, setNewResourceAuthor] = useState('');
	const [newResourceLevel, setNewResourceLevel] = useState(0);

	const [resourceName, setResourceName] = useState('');
	const [resourceUri, setResourceUri] = useState('CHOOSE');
	const [resourceDesc, setResourceDesc] = useState('');
	const [resourceLink, setResourceLink] = useState('');
	const [resourceAuthor, setResourceAuthor] = useState('');
	const [resourceLevel, setResourceLevel] = useState(0);

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
	const resourceQuery = trpc.library.resource.useQuery(
		{
			uri: resourceUri,
		},
		{
			enabled: resourceUri !== 'CHOOSE',
		}
	);

	useEffect(() => {
		if (catQuery.data) {
			setCategoryName(catQuery.data.name);
			setCategoryDesc(catQuery.data.description);
			setCategoryLevel(catQuery.data.level);
		}
	}, [catQuery.data]);

	useEffect(() => {
		if (resourceQuery.data) {
			setResourceName(resourceQuery.data.name);
			setResourceDesc(resourceQuery.data.description);
			setResourceLink(resourceQuery.data.link);
			setResourceAuthor(resourceQuery.data.author);
			setResourceLevel(resourceQuery.data.level);
		}
	}, [resourceQuery.data]);

	const currentCats =
		path.length > 0 ? catQuery.data?.categoryChildren : rootQuery.data;

	const addCategoryMutation = trpc.library.addCategory.useMutation();
	const updateCategoryMutation = trpc.library.updateCategory.useMutation();
	const deleteCategoryMutation = trpc.library.deleteCategory.useMutation();
	const addResourceMutation = trpc.library.addResource.useMutation();
	const updateResourceMutation = trpc.library.updateResource.useMutation();
	const deleteResourceMutation = trpc.library.deleteResource.useMutation();

	return (
		<main>
			<section className="centered flex w-screen flex-col items-center justify-start gap-10 bg-gray-1 px-10">
				<h2 className="text-5xl">Library Editor</h2>
				<div className="flex w-full flex-col items-center justify-start gap-4 rounded-md bg-gray-2 p-4">
					<p className="text-3xl">Category</p>
					<div className="flex w-full flex-row flex-wrap items-center justify-center gap-3 text-2xl">
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
				<div className="flex w-full flex-col items-center justify-start gap-10 md:flex-row md:items-start md:justify-center">
					<div className="flex w-full flex-grow flex-col items-center justify-start gap-5 md:w-auto">
						{path.length > 0 && (
							<div className="flex w-full flex-col items-center justify-start gap-5 rounded-md bg-gray-2 p-4">
								<p className="text-3xl">Edit Category</p>
								<div className="flex w-3/4 flex-col items-start justify-start">
									<label className="text-lg">Name</label>
									<input
										type="text"
										value={categoryName}
										onChange={(e) => setCategoryName(e.target.value)}
										className="w-full rounded-md p-2 text-lg text-black"
									/>
								</div>
								<div className="flex w-3/4 flex-col items-start justify-start">
									<label className="text-lg">Description</label>
									<textarea
										value={categoryDesc}
										onChange={(e) => setCategoryDesc(e.target.value)}
										className="w-full rounded-md p-2 text-lg text-black"
									/>
								</div>
								<div className="flex w-3/4 flex-col items-start justify-start">
									<label className="text-lg">Level</label>
									<input
										type="number"
										min={0}
										max={2}
										value={categoryLevel}
										onChange={(e) => setCategoryLevel(Number(e.target.value))}
										className="w-full rounded-md p-2 text-lg text-black"
									/>
								</div>
								<div className="flex flex-row items-center justify-center gap-5">
									<button
										className="rounded-md bg-blue-700 py-2 px-5 text-2xl"
										onClick={() => {
											if (categoryName && categoryDesc) {
												updateCategoryMutation
													.mutateAsync({
														name: categoryName,
														uri: path[path.length - 1],
														description: categoryDesc,
														level: categoryLevel,
													})
													.then(() => {
														rootQuery.refetch();
														catQuery.refetch();
													});

												setCategoryName('');
												setCategoryDesc('');
												setCategoryLevel(0);
											}
										}}
									>
										Edit
									</button>
									<button
										className="rounded-md bg-red-700 py-2 px-5 text-2xl"
										onClick={() => {
											if (path[path.length - 1]) {
												deleteCategoryMutation
													.mutateAsync({
														uri: path[path.length - 1],
													})
													.then(() => {
														rootQuery.refetch();
														catQuery.refetch();
														setPath((p) => p.slice(0, p.length - 1));
													});

												setCategoryName('');
												setCategoryDesc('');
												setCategoryLevel(0);
											}
										}}
									>
										Delete
									</button>
								</div>
							</div>
						)}
						<div className="flex w-full flex-col items-center justify-start gap-5 rounded-md bg-gray-2 p-4">
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
					</div>
					<div className="flex w-full flex-grow flex-col items-center justify-start gap-5 md:w-auto">
						<div className="flex w-full flex-col items-center justify-start gap-5 rounded-md bg-gray-2 p-4">
							<p className="text-3xl">Edit Resource</p>
							<div className="flex w-3/4 flex-col items-start justify-start">
								<label className="text-lg">Resource</label>
								<select
									value={resourceUri}
									onChange={(e) => setResourceUri(e.target.value)}
									className="rounded-md bg-white p-2 text-xl text-black"
								>
									<option value="CHOOSE">Choose a resource...</option>
									{catQuery.data?.resourceChildren?.map((res) => (
										<option key={res.uri} value={res.uri}>
											{res.name}
										</option>
									))}
								</select>
							</div>
							<div className="flex w-3/4 flex-col items-start justify-start">
								<label className="text-lg">Name</label>
								<input
									type="text"
									value={resourceName}
									onChange={(e) => setResourceName(e.target.value)}
									className="w-full rounded-md p-2 text-lg text-black"
								/>
							</div>
							<div className="flex w-3/4 flex-col items-start justify-start">
								<label className="text-lg">Description</label>
								<textarea
									value={resourceDesc}
									onChange={(e) => setResourceDesc(e.target.value)}
									className="w-full rounded-md p-2 text-lg text-black"
								/>
							</div>
							<div className="flex w-3/4 flex-col items-start justify-start">
								<label className="text-lg">Link</label>
								<input
									type="url"
									value={resourceLink}
									onChange={(e) => setResourceLink(e.target.value)}
									className="w-full rounded-md p-2 text-lg text-black"
								/>
							</div>
							<div className="flex w-3/4 flex-col items-start justify-start">
								<label className="text-lg">Author</label>
								<input
									type="text"
									value={resourceAuthor}
									onChange={(e) => setResourceAuthor(e.target.value)}
									className="w-full rounded-md p-2 text-lg text-black"
								/>
							</div>
							<div className="flex w-3/4 flex-col items-start justify-start">
								<label className="text-lg">Level</label>
								<input
									type="number"
									min={0}
									max={2}
									value={resourceLevel}
									onChange={(e) => setResourceLevel(Number(e.target.value))}
									className="w-full rounded-md p-2 text-lg text-black"
								/>
							</div>
							<div className="flex flex-row items-center justify-center gap-5">
								<button
									className="rounded-md bg-blue-700 py-2 px-5 text-2xl"
									onClick={() => {
										if (
											resourceName &&
											resourceUri &&
											resourceDesc &&
											resourceLink.startsWith('https://') &&
											resourceAuthor &&
											path[path.length - 1]
										) {
											updateResourceMutation
												.mutateAsync({
													name: resourceName,
													uri: resourceUri,
													description: resourceDesc,
													link: resourceLink,
													author: resourceAuthor,
													level: resourceLevel,
												})
												.then(() => {
													rootQuery.refetch();
													catQuery.refetch();
												});

											setResourceName('');
											setResourceUri('CHOOSE');
											setResourceDesc('');
											setResourceLink('');
											setResourceAuthor('');
											setResourceLevel(0);
										}
									}}
								>
									Edit
								</button>
								<button
									className="rounded-md bg-red-700 py-2 px-5 text-2xl"
									onClick={() => {
										if (resourceUri && path[path.length - 1]) {
											deleteResourceMutation
												.mutateAsync({
													uri: resourceUri,
												})
												.then(() => {
													rootQuery.refetch();
													catQuery.refetch();
												});

											setResourceName('');
											setResourceUri('CHOOSE');
											setResourceDesc('');
											setResourceLink('');
											setResourceAuthor('');
											setResourceLevel(0);
										}
									}}
								>
									Delete
								</button>
							</div>
						</div>
						<div className="flex w-full flex-col items-center justify-start gap-5 rounded-md bg-gray-2 p-4">
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
										newResourceLink.startsWith('https://') &&
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
				</div>
			</section>
		</main>
	);
}

export default Editor;
