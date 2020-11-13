import { useRouter } from "next/router";
import { useStore } from "../../store";
import { setUser } from "../../store/actions";
import { withMiddlewares, withPassport } from "../../middlewares";
const User = ({ user }) => {
	const router = useRouter();
	const [_, dispatch] = useStore();

	if (typeof window !== "undefined") {
		localStorage.setItem("user", JSON.stringify(user));
		dispatch(setUser(user));
		router.replace("/");
	}

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
