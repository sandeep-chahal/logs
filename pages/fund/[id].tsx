import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getFund } from "../../utils/fetch/fund";
import { IFund } from "../../models/fund";

const Fund = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [fund, setFund] = useState<IFund | null>(null);
	const router = useRouter();

	useEffect(() => {
		(async () => {
			const data = await getFund(router.query.id);
			if (!data || data.error) setError(data.msg);
			else setFund(data.data.fund);
			setLoading(false);
		})();
	}, []);

	if (loading)
		return <div className="h-screen text-center text-2xl">Loading...</div>;
	if (error)
		return <div className="h-screen text-center text-2xl">{error}</div>;
	if (fund)
		return (
			<div>
				<h1 className="h-screen">{fund.title}</h1>
			</div>
		);

	return (
		<div className="h-screen text-center text-2xl">Something went wrong!</div>
	);
};
export default Fund;
