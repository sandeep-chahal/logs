import React, { useRef, useState } from "react";
import { IShortPost } from "../models/post";
import Post from "../components/post";
import NProgress from "nprogress";
import Head from "next/head";
import { useStore } from "../store";
import { showModal } from "../store/actions";

type SResult = {
	error: boolean;
	data?: IShortPost[];
	errors?: [{ msg: string }];
};

const Search = () => {
	const [_, dispatch] = useStore();
	const [moreAvail, setMoreAvail] = useState(false);
	const [loading, setLoading] = useState(false);
	const [posts, setPosts] = useState<IShortPost[] | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleSearch = (more = false) => {
		if (!inputRef || loading) return;
		const query = inputRef.current?.value;
		if (!query || query.length < 3)
			return dispatch(
				showModal(true, {
					msg: "Search query length must be greater then 3 char.",
					type: "ERROR",
				})
			);
		setLoading(true);
		NProgress.start();
		fetch(
			`/api/post/search?q=${query}&skip=${posts && more ? posts.length : 0}`
		)
			.then((res) => res.json())
			.then((data: SResult) => {
				if (data.error) {
					dispatch(
						showModal(true, {
							msg: data.errors ? data.errors[0] : "something went wrong",
							type: "ERROR",
						})
					);
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
				dispatch(
					showModal(true, {
						msg: "something went wrong",
						type: "ERROR",
					})
				);
				setMoreAvail(false);
			})
			.finally(() => {
				setLoading(false);
				NProgress.done();
			});
	};
	return (
		<div className="w-11/12 lg:w-4/5 m-auto min-h-screen font-medium">
			<Head>
				<title>DevLogs | Search</title>
				<meta name="description" content="search from thousands of posts." />
			</Head>
			{/* search input */}
			<form
				className="flex shadow-md"
				onSubmit={(e) => {
					e.preventDefault();
					handleSearch(false);
				}}
			>
				<input
					autoFocus
					ref={inputRef}
					className="p-2 w-full"
					type="text"
					placeholder="Search something..."
				/>
				<button type="submit" className="font-medium p-3">
					Search
				</button>
			</form>

			{Array.isArray(posts) && !posts.length ? (
				<div className="w-4/5 m-auto mt-10 text-center">
					I guess we don't have it 🙀
				</div>
			) : null}
			{!Array.isArray(posts) ? (
				<div className="w-4/5 m-auto mt-10 text-center">
					Search something cool 😺
				</div>
			) : null}

			{Array.isArray(posts) && posts.length ? (
				<>
					<div className="mt-5 md:mt-10">
						<div className="ml-1 mb-1 md:mb-5">
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
