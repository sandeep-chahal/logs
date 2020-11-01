import getPost from "../../services/getPost";
import withMiddleware from "../../middlewares/withMiddlewares";
import withPassport from "../../middlewares/withPassport";
import withValidation from "../../middlewares/withValidation";

const Post = ({ post, liked, comments }) => {
	return <div>{post.title}</div>;
};

export const getServerSideProps = async (ctx) => {
	ctx.req.params = ctx.params;
	await withMiddleware(ctx.req, ctx.res, [
		withPassport,
		withValidation("get-post"),
	]);
	const data = await getPost(ctx.params.id, ctx.req.user);
	if (!data) ctx.res.redirect("/");
	return {
		props: JSON.parse(JSON.stringify(data)),
	};
};

export default Post;
