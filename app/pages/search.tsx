import axios from 'axios';
import Image from "next/image";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import Card from '../components/card';
import { trpc } from '../util/trpc';

import HeadStyle from '../styles/Head.module.css';
import SearchStyle from '../styles/Search.module.css';

import SearchIcon from '../public/search.png';

import { ChangeEvent, MouseEvent, KeyboardEvent } from 'react';

function Search() {
	const router = useRouter();

	const [query, setQuery] = useState('');

	const searchQuery = trpc.search.useQuery({ query: typeof router.query.query === 'string' ? router.query.query : '' }, { enabled: !!router.query.query });

	useEffect(() => {
		if (!router.query.query) return;
		searchQuery.refetch();
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

	function listResults(type: 'resource' | 'category' | 'roadmap') {
		if (!searchQuery.data) {
			return <p>Loading....</p>;
		} else if (searchQuery.isError) {
			return <p>There was an error fetching the results.</p>;
		} else {
			console.log(searchQuery.data);
			return searchQuery.data[type]?.map((result) => {
				const isResource = type === 'resource';
				const isCategory = type === 'category';
				const isRoadmap = type === 'roadmap';



				return <Card
					key={result.name}
					uri={result.uri}
					name={result.name}
					description={result.description}
					resource={isResource}
					category={isCategory}
					roadmap={isRoadmap}
				/>;
			});
		}
	}

	return (
		<main>
			<section className={HeadStyle.head}>
				<h2>Search {router.query.query ? 'Results' : null}</h2>
				<div className={SearchStyle.searchBar}>
					<input
						type="search"
						autoComplete="on"
						name="query"
						placeholder="Browse our collection"
						value={query}
						onChange={handleChange}
						onKeyDown={handleSearch}
					/>
					<div>
						<div>
							<Image
								onClick={handleSearch}
								height={36}
								width={36}
								src={SearchIcon}
								alt="search"
								className="searchIcon"
								style={{
									maxWidth: "100%",
									height: "auto"
								}} />
						</div>
					</div>
				</div>
			</section>
			<section className={`section1`}>
				<h3>Resources</h3>
				<hr />
				<div className={SearchStyle.results}>{listResults('resource')}</div>
				<br />
				<h3>Roadmaps</h3>
				<hr />
				<div className={SearchStyle.results}>{listResults('roadmap')}</div>
				<br />
				<h3>Categories</h3>
				<hr />
				<div className={SearchStyle.results}>{listResults('category')}</div>
			</section>
		</main>
	);
}

export default Search;
