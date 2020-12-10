import React, { useState } from "react";
import { getLatest } from "../utils/fetch/post";
import Post from "../components/post";
import { IShortPost } from "../models/post";
import useSWR from "swr";

const tags = ["javascript", "web", "tech", "nextjs", "nodejs", "reactjs"];

const Home = () => {
	const [selectedTag, setSelectedTag] = useState<string | null>(null);
	const { data, error } = useSWR<IShortPost[]>("latest", getLatest, {
		revalidateOnFocus: false,
	});

	const posts = data?.filter((post) =>
		selectedTag ? post.tags.includes(selectedTag) : true
	);

	const handleTagChange = (tag: string) => {
		setSelectedTag((prev) => {
			if (prev === tag) return null;
			return tag;
		});
	};
	return (
		<div className="w-4/5 m-auto flex mt-1 items-baseline min-h-screen">
			<div className="w-1/5 relative">
				<div className="p-4 text-darkBlue fixed w-64">
					<h3 className="text-2xl font-bold mb-3">Tags</h3>
					<ul>
						{tags.map((tag) => (
							<li
								onClick={() => handleTagChange(tag)}
								key={tag}
								className={`mb-2 cursor-pointer text-lg font-semibold tracking-wider hover:text-primary ${
									tag === selectedTag && "text-primary"
								}`}
							>
								#{tag}
							</li>
						))}
					</ul>
				</div>
			</div>
			<div className="w-2/3 m-auto mt-1">
				<h1 className="text-3xl p-2 font-bold text-darkBlue mb-3">
					Latest Posts
				</h1>
				{error ? <div>Something went wrong!</div> : null}
				{Array.isArray(posts) && posts.length > 0 ? (
					posts
						.filter((post) => !selectedTag || post.tags.includes(selectedTag))
						.map((post) => <Post key={post._id} post={post} />)
				) : (
					<div className="p-2 mt-3">Loading ...</div>
				)}
			</div>
		</div>
	);
};

export default Home;
