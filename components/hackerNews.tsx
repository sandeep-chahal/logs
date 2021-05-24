import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IHackerNews } from "../types/index";
import Link from "next/link";

const containerVarient = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
	},
};

const itemVarient = (i: number) => ({
	hidden: { opacity: 0, y: 100 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			delay: 0.1 * i,
		},
	},
});

const HackerNews = (props: { news: IHackerNews[] }) => {
	return (
		<div
			style={{ top: "80px" }}
			className="sticky-card md:sticky bg-white md:p-4 w-11/12 md:w-1/3 md:mr-12 overflow-y-auto"
		>
			<h2 className="text-xl font-bold mb-4">Latest Hacker News</h2>
			<motion.div variants={containerVarient} initial="hidden" animate="show">
				{Array.isArray(props.news) && props.news.length ? (
					props.news.map((news, i) => (
						<motion.div
							variants={itemVarient(i)}
							initial="hidden"
							animate="show"
							key={news.id}
						>
							<Link href={news.url}>
								<a
									target="_blank"
									href={news.url}
									className="block mb-6 hover:text-primary transition-colors duration-200"
								>
									<h2 className="text-lg font-medium">{news.title}</h2>
									<h4>{news.by}</h4>
								</a>
							</Link>
						</motion.div>
					))
				) : (
					<div>Failed to fetch news!</div>
				)}
			</motion.div>
		</div>
	);
};

export default HackerNews;
