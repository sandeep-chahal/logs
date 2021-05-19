import withMiddlewares from "../../../middlewares";
import FundEditor from "../../../components/fundEditor";
import Fund from "../../../models/fund";
import Head from "next/head";

const Edit = (props) => {
	return (
		<>
			<Head>
				<title>DevLogs | Edit Fund</title>
			</Head>
			<FundEditor edit={true} {...props} />
		</>
	);
};

export const getServerSideProps = async (ctx) => {
	const { req, res } = ctx;
	req.body = { _id: ctx.params.id };
	const result = await withMiddlewares(req, res, "1 2 3", "valid-id");
	if (result.error)
		return {
			redirect: {
				permanent: false,
				destination: `/error?error_code=${result.code}`,
			},
		};

	const data = await Fund.findById(ctx.params.id);
	console.log(data);
	if (String(data.user) !== req.user._id)
		return {
			redirect: {
				permanent: false,
				destination: `/error?error_code=103`,
			},
		};
	return {
		props: JSON.parse(JSON.stringify(data)),
	};
};

export default Edit;
