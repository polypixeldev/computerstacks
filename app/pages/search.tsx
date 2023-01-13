import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import Card from '../components/card';
import { trpc } from '../util/trpc';

import SearchIcon from '../public/search.png';

import { ChangeEvent, MouseEvent, KeyboardEvent } from 'react';

function Search() {
	const router = useRouter();

	const [query, setQuery] = useState('');

	const searchQuery = trpc.search.useQuery(
		{ query: typeof router.query.query === 'string' ? router.query.query : '' },
		{ enabled: !!router.query.query }
	);

	useEffect(() => {
		if (!router.query.query) return;
		searchQuery.refetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.query]);

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		if (name === 'query') setQuery(value);
	}

	function handleSearch(event: MouseEvent | KeyboardEvent) {
		if ('key' in event && event.key !== 'Enter') return;
		setQuery('');
		router.push(`/search?query=${query}`);
	}

	function listResultSections() {
		let component;

		if (!router.query.query) {
			return null;
		} else if (!searchQuery.data) {
			component = <p className="text-4xl">Loading....</p>;
		} else if (searchQuery.isError) {
			component = (
				<p className="text-4xl">There was an error fetching the results.</p>
			);
		} else {
			component = (
				<>
					{listResults('resource')}
					{listResults('category')}
					{listResults('roadmap')}
				</>
			);
		}

		return <section className="bg-gray-1">{component}</section>;
	}

	function listResults(type: 'resource' | 'category' | 'roadmap') {
		if (
			!searchQuery.data ||
			!searchQuery.data[type] ||
			searchQuery.data[type].length === 0
		) {
			return null;
		} else {
			const results = searchQuery.data[type]?.map((result) => {
				const isResource = type === 'resource';
				const isCategory = type === 'category';
				const isRoadmap = type === 'roadmap';

				return (
					<Card
						key={result.name}
						uri={result.uri}
						name={result.name}
						description={result.description}
						resource={isResource}
						category={isCategory}
						roadmap={isRoadmap}
					/>
				);
			});

			return (
				<div className="w-full">
					<h3 className="text-4xl">{`${type[0].toUpperCase()}${type.slice(
						1,
						type.length
					)}`}</h3>
					<div className="ml-5 mr-5 flex w-full flex-col items-center justify-start">
						{results}
					</div>
				</div>
			);
		}
	}

	return (
		<main>
			<section className="bg-head-3">
				<h2 className="mb-2 text-5xl">
					Search {router.query.query ? 'Results' : null}
				</h2>
				<div className="flex h-min w-2/3 flex-row gap-2 rounded-sm border-2 border-head-4 bg-head-2 p-4 outline-none">
					<Image
						onClick={handleSearch}
						height={36}
						width={36}
						src={SearchIcon}
						alt="search"
						className="searchIcon"
					/>
					<input
						type="search"
						autoComplete="on"
						name="query"
						placeholder="Browse our collection"
						value={query}
						onChange={handleChange}
						onKeyDown={handleSearch}
						className="min-h-min w-full rounded-sm border-none bg-head-1 pl-2 font-zilla-slab text-xl text-black placeholder:text-gray-800"
					/>
				</div>
			</section>
			{listResultSections()}
		</main>
	);
}

export default Search;
