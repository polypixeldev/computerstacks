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
		if (!router.query.query) return;
		const SEARCH_URL = `/api/search`;
		axios
			.get(SEARCH_URL, { params: { query: router.query.query } })
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

	function handleSearch(event) {
		if (event.key && event.key !== "Enter") return;
		setQuery("");
		router.push(`/search?query=${query}`);
	}

	function listResults(type) {
		if (results === null) {
			return <p>Loading....</p>;
		} else if (results === "error") {
			return <p>There was an error fetching the results.</p>;
		} else {
			console.log(results[type]);
			return results[type].map((result) => (
				<SearchResult type={type} key={result.name} {...result} />
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
							/>
						</div>
					</div>
				</div>
			</section>
			<section className={`section1`}>
				<h3>Resources</h3>
				<hr />
				<div className={SearchStyle.results}>{listResults("resource")}</div>
				<br />
				<h3>Roadmaps</h3>
				<hr />
				<div className={SearchStyle.results}>{listResults("roadmap")}</div>
				<br />
				<h3>Categories &amp; Subcategories</h3>
				<hr />
				<div className={SearchStyle.results}>{listResults("category")}</div>
			</section>
		</main>
	);
}

export default Search;
