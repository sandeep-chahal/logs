import { useRouter } from "next/router";
import { useStore } from "../../store";
import { setUser } from "../../store/actions";
import withMiddlewares from "../../middlewares";
import { useEffect } from "react";
import Head from "next/head";
const User = ({ user }) => {
	const router = useRouter();
	const [_, dispatch] = useStore();

	useEffect(() => {
		dispatch(setUser(user));
		localStorage.setItem("user", JSON.stringify(user));
		router.push("/");
	}, []);

	return (
		<>
			<Head>
				<title>Signing In</title>
			</Head>
			<div className="min-h-screen">Wait</div>
		</>
	);
};

export const getServerSideProps = async ({ req, res }) => {
	await withMiddlewares(req, res, "1");

	return {
		props: {
			user: req.user,
		},
	};
};

export default User;
