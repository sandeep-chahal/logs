import { useRouter } from "next/router";
import { useStore } from "../../store";
import { setUser } from "../../store/actions";
import { withMiddlewares, withPassport } from "../../middlewares";
import { useEffect } from "react";
const User = ({ user }) => {
	const router = useRouter();
	const [_, dispatch] = useStore();

	useEffect(() => {
		dispatch(setUser(user));
		localStorage.setItem("user", JSON.stringify(user));
		router.push("/");
	}, []);

	return <div>Wait</div>;
};

export const getServerSideProps = async ({ req, res }) => {
	await withMiddlewares(req, res, [withPassport]);

	return {
		props: {
			user: req.user,
		},
	};
};

export default User;
