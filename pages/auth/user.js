import { useEffect } from "react";
import { useRouter } from "next/router";
import { useStore } from "../../store";
import { setUser } from "../../store/actions";
const User = () => {
	const router = useRouter();
	const [_, dispatch] = useStore();

	useEffect(() => {
		fetch("/api/auth/user")
			.then((res) => res.json())
			.then((user) => {
				localStorage.setItem("user", JSON.stringify(user));
				dispatch(setUser(user));
			})
			.catch((err) => {
				localStorage.setItem("user", null);
				dispatch(setUser(null));
			})
			.finally(() => {
				router.replace("/");
			});
	}, []);
	return <div>Wait</div>;
};

export default User;
