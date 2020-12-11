import withMiddlewares from "../../../middlewares";
import getEditPostData from "../../../services/getEditPostData";
import PostEditor from "../../../components/postEditor";
import Head from "next/head";

const Edit = (props) => {
	return (
		<>
			<Head>
				<title>Edit Post</title>
			</Head>
			<PostEditor edit={true} {...props} />
		</>
	);
};

export const getServerSideProps = async (ctx) => {
	ctx.req.body = { _id: ctx.params.id };
	const result = await withMiddlewares(ctx.req, ctx.res, "1 2 3", "valid-id");
	if (result.error) return ctx.res.redirect("/error?error_code=" + result.code);
	const data = await getEditPostData(ctx.params.id, ctx.req.user);
	if (data.error) return ctx.res.redirect("/error?code=" + data.code);
	return {
		props: JSON.parse(JSON.stringify(data.post)),
	};
};

export default Edit;
