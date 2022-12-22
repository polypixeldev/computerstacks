import axios from 'axios';
import Image from "next/image";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import Card from '../components/card';

import HeadStyle from '../styles/Head.module.css';
import SearchStyle from '../styles/Search.module.css';

import SearchIcon from '../public/search.png';

import { ChangeEvent, MouseEvent, KeyboardEvent } from 'react';

function Search() {
	const router = useRouter();

	const [query, setQuery] = useState('');
	const [results, setResults] = useState<any | "error" | null>(null);

	useEffect(() => {
		if (!router.query.query) return;
		const SEARCH_URL = `/api/search`;
		axios
			.get(SEARCH_URL, { params: { query: router.query.query } })
			.then((res) => {
				setResults(res.data);
			})
			.catch(() => {
				setResults('error');
			});
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

	function listResults(type: any) {
		if (results === null) {
			return <p>Loading....</p>;
		} else if (results === 'error') {
			return <p>There was an error fetching the results.</p>;
		} else {
			if (!results) return null;
			return results[type].map((result: any) => {
				const resultObj: (typeof result & { subcategory?: string, category?: string }) = { ...result };

				if ('parent' in resultObj) {
					if ('parent' in resultObj.parent) {
						resultObj.subcategory = resultObj.parent.uri;
						resultObj.category = resultObj.parent.parent.uri;
					} else {
						resultObj.category = resultObj.parent.uri;
					}
				}

				return <Card key={result.name} {...resultObj} />;
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
				<h3>Categories &amp; Subcategories</h3>
				<hr />
				<div className={SearchStyle.results}>{listResults('category')}</div>
			</section>
		</main>
	);
}

export default Search;
