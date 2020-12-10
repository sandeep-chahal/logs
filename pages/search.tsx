import React, { useRef, useState } from "react";
import { IShortPost } from "../models/post";
import Post from "../components/post";
import NProgress from "nprogress";
import Head from "next/head";

type SResult = {
	error: boolean;
	data?: IShortPost[];
	errors?: [{ msg: string }];
};

const Search = () => {
	const [moreAvail, setMoreAvail] = useState(false);
	const [loading, setLoading] = useState(false);
	const [posts, setPosts] = useState<IShortPost[] | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleSearch = (more = false) => {
		if (!inputRef || loading) return;
		const query = inputRef.current?.value;
		if (!query || query.length < 3)
			return alert("Query must be greater then 3");
		setLoading(true);
		NProgress.start();
		fetch(
			`/api/post/search?q=${query}&skip=${posts && more ? posts.length : 0}`
		)
			.then((res) => res.json())
			.then((data: SResult) => {
				if (data.error) {
					alert(data.errors ? data.errors[0] : "something went wrong");
					setMoreAvail(false);
				} else if (data.data) {
					const newPosts = [...(posts && more ? posts : []), ...data.data];
					setPosts(newPosts);
					setMoreAvail(data.data.length < 15 ? false : true);
				} else {
					setMoreAvail(false);
				}
			})
			.catch((err) => {
				alert("something went wrong");
				setMoreAvail(false);
			})
			.finally(() => {
				setLoading(false);
				NProgress.done();
			});
	};
	return (
		<div className="min-h-screen font-medium">
			<Head>
				<title>DevLogs | Search</title>
				<meta name="description" content="search from thousands of posts." />
			</Head>
			<form
				className="m-auto w-4/5 flex shadow-md"
				onSubmit={(e) => {
					e.preventDefault();
					handleSearch(false);
				}}
			>
				<input
					ref={inputRef}
					className="p-2 w-full"
					type="text"
					placeholder="Search something..."
				/>
				<button type="submit" className="font-medium p-3">
					Search
				</button>
			</form>
			{/* {loading ? (
				<div className="w-4/5 m-auto mt-10 text-center">
					Searching in Database...
				</div>
			) : null} */}
			<div className="w-4/5 m-auto mt-10 text-center">
				{Array.isArray(posts) && !posts.length
					? "I guess we don't have it 🙀"
					: null}
				{!Array.isArray(posts) ? "Search something cool 😺" : null}
			</div>
			{Array.isArray(posts) && posts.length ? (
				<>
					<div className="w-4/5 m-auto mt-10">
						<div>
							{posts.length}
							{moreAvail ? "+" : ""} result(s) found 😽
						</div>
						{posts.map((post) => (
							<Post post={post} key={post._id} />
						))}
					</div>
					{moreAvail ? (
						<button
							onClick={() => handleSearch(true)}
							className="p-2 px-10 m-auto block bg-white hover:shadow-md"
						>
							More
						</button>
					) : null}
				</>
			) : null}
		</div>
	);
};

export default Search;
