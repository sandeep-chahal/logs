import React, { useState, useEffect } from "react";
import { IHackerNews } from "../types/index";
import Link from "next/link";

const HackerNews = (props: { news: IHackerNews[] }) => {
	return (
		<div
			style={{ top: "80px" }}
			className="hacker-news md:sticky bg-white md:p-4 w-11/12 md:w-1/3 md:mr-12 overflow-y-auto"
		>
			<h2 className="text-xl font-bold mb-4">Latest Hacker News</h2>
			<div>
				{props.news.map((news) => (
					<Link href={news.url} key={news.id}>
						<a
							target="_blank"
							href={news.url}
							className="block mb-6 hover:text-primary"
						>
							<h2 className="text-lg font-medium">{news.title}</h2>
							<h4>{news.by}</h4>
						</a>
					</Link>
				))}
			</div>
		</div>
	);
};

export default HackerNews;
