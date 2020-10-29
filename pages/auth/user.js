import { useEffect } from "react";
import { useRouter } from "next/router";
const User = () => {
	const router = useRouter();

	useEffect(() => {
		fetch("/api/auth/user")
			.then((res) => res.json())
			.then((user) => {
				localStorage.setItem("user", JSON.stringify(user));
			})
			.catch((err) => {
				localStorage.setItem("user", null);
			})
			.finally(() => {
				router.replace("/");
			});
	}, []);
	return <div>Wait</div>;
};

export default User;
