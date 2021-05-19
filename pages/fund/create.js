import withMiddlewares from "../../middlewares";
import FundEditor from "../../components/fundEditor";
import Head from "next/head";

const Create = () => {
	return (
		<>
			<Head>
				<title>DevLogs | Create new fund</title>
			</Head>
			<FundEditor edit={false} />
		</>
	);
};

export const getServerSideProps = async ({ req, res }) => {
	const result = await withMiddlewares(req, res, "1 2");
	if (result.error) {
		return {
			redirect: {
				permanent: false,
				destination: `/error?error_code=${result.code}`,
			},
		};
	}
	return {
		props: {},
	};
};

export default Create;
