import {
	withMiddlewares,
	withAuthentication,
	withPassport,
} from "../../middlewares";
import PostEditor from "../../components/postEditor";
import Head from "next/head";

const Add = () => {
	return (
		<>
			<Head>
				<title>DevLogs | Create new post</title>
			</Head>
			<PostEditor edit={false} />
		</>
	);
};

export const getServerSideProps = async ({ req, res }) => {
	const result = await withMiddlewares(req, res, [
		withPassport,
		withAuthentication,
	]);
	if (result.error) {
		return res.redirect("/error?error_code=" + result.code);
	}
	return {
		props: {},
	};
};

export default Add;
