import React, { useState, useEffect } from "react";
import Link from "next/link";
import fund, { IFund } from "../models/fund";
import { IUser } from "../models/user";
import { formatNumber } from "../utils";

// @ts-ignore
export interface IExtFund extends IFund {
	user: IUser;
}

interface IProps {
	fund: IExtFund;
}

const MiniFund = (props: IProps) => {
	return (
		<Link href={`/fund/${props.fund._id}`}>
			<a
				href={`/fund/${props.fund._id}`}
				style={{ minWidth: "256px" }}
				className="block bg-white rounded w-64 mr-3 px-3 py-1"
			>
				<h2 className="font-bold text-lg">{props.fund.title}</h2>
				<h4 className="font-thin capitalize text-sm">{props.fund.user.name}</h4>
				{/* raised bar */}
				<div className="h-5 bg-gray-100 my-3 relative">
					<div
						className="h-5 bg-primary"
						style={{
							width: `${(props.fund.raised / props.fund.total) * 100}%`,
							maxWidth: "100%",
						}}
					></div>
					<span className="abs-center font-medium">
						{formatNumber(props.fund.raised)}/{formatNumber(props.fund.total)}
					</span>
				</div>
			</a>
		</Link>
	);
};

export default MiniFund;
