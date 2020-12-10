import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { getLatest } from "../services/redis";
import Post from "../components/post";
import { IShortPost } from "../models/post";

const tags = ["javascript", "web", "tech", "nextjs", "nodejs", "reactjs"];

interface IProps {
	posts: null | IShortPost[];
}

const Home = ({ posts }: IProps) => {
	const [selectedTag, setSelectedTag] = useState<string | null>(null);

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
				<h1 className="text-3xl p-2 font-bold text-darkBlue ">Latest Posts</h1>
				{Array.isArray(posts) && posts.length > 0 ? (
					posts
						.filter((post) => !selectedTag || post.tags.includes(selectedTag))
						.map((post) => <Post key={post._id} post={post} />)
				) : (
					<div className="bg-white p-2 mt-3">No Posts Available!</div>
				)}
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async () => {
	const posts = await getLatest();
	return {
		props: {
			posts: posts,
		},
	};
};

export default Home;
