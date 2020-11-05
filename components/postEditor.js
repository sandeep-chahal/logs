import { useState } from "react";
import TagSelector from "./tagSelector";
import ReactMarkdown from "react-markdown";
import { modifyPost } from "../utils/fetch/post";
import { useRouter } from "next/router";

const PostEditor = (props) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState([]);
	const [title, setTitle] = useState(props.title);
	const [markdown, setMarkdown] = useState(props.markdown || "");
	const [headerImg, setHeaderImg] = useState(props.headerImg || null);
	const [tags, setTags] = useState(props.tags || []);
	const router = useRouter();

	const handleFileChange = (e) => {
		setHeaderImg(e.target.files[0]);
	};

	const handleSubmit = () => {
		if (loading) return;
		setLoading(true);
		setError([]);
		modifyPost(props.edit, props._id, headerImg, title, tags, markdown).then(
			(res) => {
				if (res.error) {
					if (res.msg) setError(res.msg);
					else setError(res.errors);
					setLoading(false);
				} else {
					router.replace("/post/" + res.data._id);
				}
			}
		);
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
					>
						{props.markdown}
					</textarea>
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
					{!loading ? (props.edit ? "Edit" : "Post it") : "okay, wait!"}
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

export default PostEditor;
