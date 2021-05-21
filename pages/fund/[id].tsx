import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getFund } from "../../utils/fetch/fund";
import { IFund } from "../../models/fund";
import { IUser } from "../../models/user";
import { formatDate, getDaysLeft, getDatePercentage } from "../../utils";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
const renderers = {
	code: ({ language = "js", value = "" }) => {
		return (
			<SyntaxHighlighter
				language={language}
				children={value
					.split("\n")
					.filter((g) => g)
					.join("\n")}
			/>
		);
	},
	link: ({ href, children }: { href: string; children: React.ReactNode }) => {
		return (
			<a className="text-blue-600 font-bold" href={href} target="_blank">
				{children}
			</a>
		);
	},
};

// @ts-ignore
interface IExtFund extends IFund {
	user: IUser;
}

const Fund = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [fund, setFund] = useState<IExtFund | null>(null);
	const router = useRouter();

	useEffect(() => {
		(async () => {
			if (!router.query.id) return;
			const data = await getFund(router.query.id);
			if (!data || data.error) setError(data.msg);
			else setFund(data.data.fund);
			setLoading(false);
		})();
	}, [router.query.id]);
	const formatNumber = (num: number) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
		}).format(num);
	};

	if (loading)
		return <div className="h-screen text-center text-2xl">Loading...</div>;
	if (error)
		return <div className="h-screen text-center text-2xl">{error}</div>;
	if (fund)
		return (
			<div className="h-screen w-4/5 m-auto flex justify-between text-black">
				<div className="w-1/2 bg-white mr-4 p-4">
					<h1 className="font-bold text-4xl">
						{fund.title} ({formatNumber(fund.total)})
					</h1>
					<div className="flex items-center">
						<img
							className="w-8 h-8 object-cover rounded-full mr-3"
							src={fund.user.photo}
						/>
						<h3 className="text-lg capitalize font-medium">{fund.user.name}</h3>
					</div>
					<h3 className="text-base capitalize font-light ml-10">
						{formatDate(fund.date)}
					</h3>
					<img src={fund.img} className="object-cover mt-3" />
					<ReactMarkdown
						renderers={renderers}
						plugins={[gfm]}
						// @ts-ignore
						style={{ minHeight: "16rem" }}
						className="w-full mt-4 p-4 markdown border-2 rounded"
						children={fund.summary}
					/>
				</div>
				{/* right */}
				<div className="w-1/2 bg-white ml-4 p-4">
					{/* donate */}
					<div className="flex justify-between font-medium items-center">
						<h2 className="text-2xl">Donate</h2>
						<button className="py-2 px-4 bg-gradient-1 text-white">Give</button>
					</div>
					{/* bars */}
					<div className="mt-6">
						{/* deadline */}
						<h4 className="font-light mb-2">DeadLine</h4>
						<div className="h-5 bg-gray-100 mb-6 relative">
							<div
								className="h-5 bg-primary"
								style={{
									width: getDatePercentage(fund.date, fund.deadline),
									maxWidth: "100%",
								}}
							></div>
							<span className="abs-center font-medium">
								{getDaysLeft(fund.deadline, new Date())} Days Left
							</span>
						</div>

						{/* raised */}
						<h4 className="font-light mb-2">Raised</h4>
						<div className="h-5 bg-gray-100 mb-6 relative">
							<div
								className="h-5 bg-primary"
								style={{
									width: `${(fund.raised / fund.total) * 100}%`,
									maxWidth: "100%",
								}}
							></div>
							<span className="abs-center font-medium">
								{formatNumber(fund.raised)}/{formatNumber(fund.total)}
							</span>
						</div>
						{/* recent dontaions */}
						<div className="bg-gray-200 mt-4 p-3">
							<h2 className="font-medium text-xl mb-4">Recent Donations</h2>
							{null ? (
								[].map((donator) => {
									// <div className="rounded bg-white p-2 mb-4">
									// 	<h4 className="font-medium text-xl">
									// 		{formatNumber(donator.amount)}
									// 	</h4>
									// 	<div className="flex items-center">
									// 		<h4 className="font-medium">{donator.name}</h4>
									// 		<h5 className="font-light ml-2 text-sm">
									// 			{formatDate(donator.date)}
									// 		</h5>
									// 	</div>
									// 	<p className="italic">{donator.msg}</p>
									// </div>;
								})
							) : (
								<div className="rounded bg-white p-2 mb-4">
									No Donations yet!
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		);

	return (
		<div className="h-screen text-center text-2xl">Something went wrong!</div>
	);
};
export default Fund;
