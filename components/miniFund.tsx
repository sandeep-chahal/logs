import React, { useState, useEffect } from "react";
import Link from "next/link";
import fund, { IFund } from "../models/fund";
import { motion } from "framer-motion";
import { IUser } from "../models/user";
import {
	formatNumber,
	formatDate,
	getDatePercentage,
	getDaysLeft,
} from "../utils";

// @ts-ignore
export interface IExtFund extends IFund {
	user: IUser;
}

interface IProps {
	fund: IExtFund;
	style?: object;
	className?: string;
	date?: boolean;
	user?: boolean;
	deadline?: boolean;
	raised?: boolean;
	barClasses?: string;
	admin?: boolean;
	fundDelete?: (id: string) => void;
}

const MiniFund = (props: IProps) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			style={{ minWidth: "256px", ...(props.style || {}) }}
			className={`block bg-white rounded w-64 mr-3 px-3 py-1 ${props.className}`}
		>
			<div className="flex justify-between">
				<Link href={`/fund/${props.fund._id}`}>
					<a href={`/fund/${props.fund._id}`}>
						<h2 className="font-bold text-lg hover:text-primary transition-colors">
							{props.fund.title}
						</h2>
					</a>
				</Link>

				{/* buttons */}
				{props.admin && (
					<div className="flex items-center">
						<img
							src="/icons/delete-bin.svg"
							className="w-6 "
							onClick={() =>
								props.fundDelete ? props.fundDelete(props.fund._id) : null
							}
						/>
						<Link href={`/fund/edit/${props.fund._id}`}>
							<a href={`/fund/edit/${props.fund._id}`}>
								<img src="/icons/edit.svg" className="w-6 ml-4 " />
							</a>
						</Link>
					</div>
				)}
			</div>
			{props.user && (
				<h4 className="font-thin capitalize text-sm">{props.fund.user.name}</h4>
			)}
			{props.date && (
				<h4 className="font-thin capitalize text-sm">
					{formatDate(props.fund.date)}
				</h4>
			)}
			{/* deadline bar */}
			{props.deadline && (
				<div className={`h-5 bg-gray-100 my-3 relative ${props.barClasses}`}>
					<motion.div
						initial={{
							width: 0,
						}}
						animate={{
							width: getDatePercentage(props.fund.date, props.fund.deadline),
							transition: {
								duration: 0.5,
								bounce: 0.5,
								type: "spring",
								stiffness: 75,
							},
						}}
						className="h-5 bg-skyBlue"
						style={{
							// width: getDatePercentage(props.fund.date, props.fund.deadline),
							maxWidth: "100%",
						}}
					></motion.div>
					<span className="abs-center font-medium">
						{getDaysLeft(props.fund.deadline, new Date())} Days Left
					</span>
				</div>
			)}
			{/* raised bar */}
			{props.raised && (
				<div className={`h-5 bg-gray-100 my-3 relative ${props.barClasses}`}>
					<motion.div
						initial={{
							width: 0,
						}}
						animate={{
							width: `${(props.fund.raised / props.fund.total) * 100}%`,
							transition: {
								duration: 0.5,
								bounce: 0.5,
								type: "spring",
								stiffness: 75,
							},
						}}
						className="h-5 bg-yellow"
						style={{
							// width: `${(props.fund.raised / props.fund.total) * 100}%`,
							maxWidth: "100%",
						}}
					></motion.div>
					<span className="abs-center font-medium">
						{formatNumber(props.fund.raised)}/{formatNumber(props.fund.total)}
					</span>
				</div>
			)}
		</motion.div>
	);
};

export default MiniFund;
