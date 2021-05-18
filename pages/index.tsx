import { GetStaticProps } from "next";
import React, { useState } from "react";
import Head from "next/head";
import Post from "../components/post";
import { IShortPost } from "../models/post";
import PostDB from "../models/post";
import User from "../models/user";
import connectDB from "../config/mongodb";
import { IHackerNews } from "../types/index";
import HackerNews from "../components/hackerNews";

const tags = [
	"javascript",
	"web",
	"nextjs",
	"nodejs",
	"reactjs",
	"server",
	"frontend",
	"backend",
	"performance",
];

interface IProps {
	posts: IShortPost[] | null;
	hackerNews: IHackerNews[];
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
		<div className="sm:w-2/3 md:w-4/5 m-auto flex flex-col-reverse md:flex-row items-center md:items-start mt-1 min-h-screen">
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
			{/* tags filter for desktop */}
			{/* <div className="w-1/5 relative hidden lg:block">
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
			</div> */}
			<HackerNews news={props.hackerNews} />

			<div className="mt-1 w-11/12 lg:w-3/4">
				<div className="justify-between mb-5 md:mb-3">
					<div className="flex flex-col md:flex-row md:items-center justify-between">
						<h1 className="text-2xl md:text-2xl font-bold text-darkBlue">
							Latest Posts
						</h1>
						{/* tags filter for mobile */}
						<div className="font-medium mt-2 md:mt-0 ">
							<span>Tags</span>
							<select
								className="font-medium p-1 ml-2 bg-white"
								onChange={(e) => handleTagChange(e.target.value)}
							>
								<option value="">All</option>
								{tags.map((tag) => (
									<option key={tag} value={tag}>
										{tag}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>
				{/* posts */}
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
	// const posts = await getLatest();
	await connectDB();
	const postsReq = PostDB.find({}, {}, { sort: { createdOn: -1 } })
		.limit(15)
		.populate({
			path: "author",
			model: User,
			select: "name",
		});
	const hackerNewsReq = await fetch(
		"https://hacker-news.firebaseio.com/v0/topstories.json"
	);

	const res = await Promise.all([postsReq, hackerNewsReq]);

	const posts = res[0];
	const hackerNewsIds = await res[1].json();

	let hackerNews = await Promise.all(
		Array.isArray(hackerNewsIds)
			? hackerNewsIds
					.filter((_, i) => i < 10)
					.map((id) =>
						fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
					)
			: []
	);

	hackerNews = await Promise.all(hackerNews.map((req) => req.json()));
	return {
		props: {
			posts: JSON.parse(JSON.stringify(posts)),
			hackerNews: hackerNews.filter((news) => news.url),
		},
		revalidate: 1000 * 60 * 1, //1 min
	};
};

export default Home;
