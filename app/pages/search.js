import { useRouter } from "next/router";
import HeadStyle from "../styles/Head.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import SearchIcon from "../public/search.png";
import SearchStyle from "../styles/Search.module.css";
import axios from "axios";
import SearchResult from "../components/searchresult";

function Search() {
	const router = useRouter();

	let [query, setQuery] = useState("");
	let [results, setResults] = useState(null);

	useEffect(() => {
		// For development
		setResults([
			{
				name: "ESLint",
				description: "Find and fix problems in your JavaScript code",
				url: "/library/javascript/clean-code/eslint",
			},
		]);
		return;

		const SEARCH_URL = ``;
		axios
			.post(SEARCH_URL, { query: router.query.query })
			.then((res) => {
				setResults(res.data);
			})
			.catch(() => {
				setResults("error");
			});
	}, [router.query.query]);

	function handleChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		if (name === "query") setQuery(value);
	}

	function handleSearch() {
		router.push(`/search?query=${query}`);
	}

	function listResults() {
		if (results === null) {
			return <p>Loading....</p>;
		} else if (results === "error") {
			return <p>There was an error fetching the results.</p>;
		} else {
			return results.map((result) => (
				<SearchResult key={result.name} {...result} />
			));
		}
	}

	return (
		<main>
			<section className={HeadStyle.head}>
				<h2>Search {router.query.query ? "Results" : null}</h2>
				<div className={SearchStyle.searchBar}>
					<input
						type="search"
						autoComplete="on"
						name="query"
						placeholder="Browse our collection"
						value={query}
						onChange={handleChange}
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
							/>
						</div>
					</div>
				</div>
			</section>
			<section className="section1">{listResults()}</section>
		</main>
	);
}

export default Search;
