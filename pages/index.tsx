import { GetStaticProps } from "next";
import React, { useState } from "react";
import Head from "next/head";
import Post from "../components/post";
import { IShortPost } from "../models/post";
import { getLatest } from "../services/redis";

const tags = ["javascript", "web", "tech", "nextjs", "nodejs", "reactjs"];

interface IProps {
	posts: IShortPost[] | null;
}

const Home = (props: IProps) => {
	const [selectedTag, setSelectedTag] = useState<string | null>(null);

	const posts = props.posts?.filter((post) =>
		selectedTag ? post.tags.includes(selectedTag) : true
	);

	const handleTagChange = (tag: string) => {
		setSelectedTag((prev) => {
			if (prev === tag) return null;
			return tag;
		});
	};
	return (
		<div className="sm:w-2/3 md:w-4/5 m-auto flex mt-1 items-baseline min-h-screen">
			<Head>
				<title>DevLog</title>
				<meta
					name="description"
					content="Explore and write interesting web articles. Cutting edge and new blogs everyday."
				/>
				<meta property="og:title" content="DevLogs" />
				<meta
					property="og:description"
					content="Explore and write interesting web articles. Cutting edge and new blogs everyday."
				/>
			</Head>
			<div className="w-1/5 relative hidden lg:block">
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
			<div className="px-2 m-auto mt-1 lg:w-2/3">
				<h1 className="text-2xl md:text-3xl p-2 font-bold text-darkBlue mb-3">
					Latest Posts
				</h1>

				{Array.isArray(posts) && posts.length > 0 ? (
					posts
						.filter((post) => !selectedTag || post.tags.includes(selectedTag))
						.map((post) => <Post key={post._id} post={post} />)
				) : (
					<div className="p-2 mt-3 text-center font-medium">
						couldn't find latest posts 🙀
					</div>
				)}
			</div>
		</div>
	);
};

export const getStaticProps: GetStaticProps = async (context) => {
	const posts = await getLatest();
	console.log("revalidated");

	return {
		props: {
			posts,
		},
		revalidate: 1000 * 60 * 10, //10 min
	};
};

export default Home;
