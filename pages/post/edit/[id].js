import { useState } from "react";
import {
	withAuthentication,
	withMiddlewares,
	withPassport,
	withValidation,
} from "../../../middlewares";
import TagSelector from "../../../components/tagSelector";
import ReactMarkdown from "react-markdown";
import { addPost } from "../../../utils/fetch/post";
import { useRouter } from "next/router";
import getEditPostData from "../../../services/getEditPostData";

const Add = (props) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState([]);
	const [title, setTitle] = useState(props.title);
	const [markdown, setMarkdown] = useState(props.markdown);
	const [headerImg, setHeaderImg] = useState(props.headerImg);
	const [tags, setTags] = useState(props.tags);
	const router = useRouter();

	const handleFileChange = (e) => {
		setHeaderImg(e.target.files[0]);
	};

	const handleSubmit = () => {
		if (loading) return;
		setLoading(true);
		setError([]);
		addPost(headerImg, title, tags, markdown).then((res) => {
			if (res.error) {
				if (res.msg) setError(res.msg);
				else setError(res.errors);
				setLoading(false);
			} else {
				router.replace("/post/" + res.data._id);
			}
		});
	};

	return (
		<section className="p-6 px-20">
			<div className="bg-white p-4">
				{/* header image */}
				<div className="flex items-start">
					<label
						htmlFor="header-img"
						className="bg-pureWhite py-1 px-2 cursor-pointer"
					>
						Upload Header Image
					</label>
					<input
						onChange={handleFileChange}
						id="header-img"
						type="file"
						accept="image/png,image/jpeg"
						hidden
					/>
					{headerImg ? (
						<img src={URL.createObjectURL(headerImg)} className="mt-6 h-64" />
					) : null}
				</div>
				{/* title */}
				<input
					type="text"
					placeholder="Title"
					className="mt-6 p-2 w-full"
					onChange={(e) => setTitle(e.target.value)}
					value={title}
				/>
				{/* tags */}
				<TagSelector
					className="my-8 flex items-center"
					setTags={setTags}
					tags={tags}
					availTags={[
						"javascript",
						"web",
						"tech",
						"nextjs",
						"nodejs",
						"reactjs",
					]}
				/>
				{/* markdown */}
				<div className="flex justify-evenly">
					<textarea
						style={{ minHeight: "16rem" }}
						className="w-full mr-4 p-4"
						onChange={(e) =>
							setMarkdown(e.target.value.replaceAll("\n", "\n\n"))
						}
						value={markdown}
					></textarea>
					<ReactMarkdown
						style={{ minHeight: "16rem" }}
						className="bg-pureWhite w-full ml-4 p-4 markdown"
						children={markdown}
					/>
				</div>

				<button
					onClick={handleSubmit}
					disabled={loading}
					className="bg-primary py-1 px-4 mt-8 m-auto block"
				>
					{!loading ? "Edit" : "okay, wait!"}
				</button>
				{Array.isArray(error) && error.length > 0 ? (
					<div className="text-center my-8">
						{error.map((err) => (
							<div key={err.msg}>{err.msg}</div>
						))}
					</div>
				) : null}
			</div>
		</section>
	);
};

export const getServerSideProps = async (ctx) => {
	ctx.req.body = { _id: ctx.params.id };
	const result = await withMiddlewares(ctx.req, ctx.res, [
		withPassport,
		withAuthentication,
		withValidation("valid-id"),
	]);
	if (result.error) return res.redirect("/error?error_code=" + result.code);
	const data = await getEditPostData(ctx.params.id, ctx.req.user);
	if (data.error) return ctx.res.redirect("/error?code=" + data.code);
	return {
		props: JSON.parse(JSON.stringify(data.post)),
	};
};

export default Add;
