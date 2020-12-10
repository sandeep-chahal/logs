import { useState } from "react";
import TagSelector from "./tagSelector";
import ReactMarkdown from "react-markdown";
import { modifyPost } from "../utils/fetch/post";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import uploadFile from "../utils/fetch/uploadFile";

import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { IPost } from "../models/post";

const renderers = {
	code: ({ language = "js", value = "" }) => {
		return <SyntaxHighlighter language={language} children={value} />;
	},
	link: ({ href, children }: { href: string; children: React.ReactNode }) => {
		return (
			<a className="text-blue-600" href={href} target="_blank">
				{children}
			</a>
		);
	},
};

type IError = {
	[k: string]: string;
};

interface IProps extends IPost {
	edit: boolean;
}

const PostEditor: React.FC<IProps> = (props) => {
	const [uploading, setUploading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<IError>({});
	const [title, setTitle] = useState(props.title);
	const [markdown, setMarkdown] = useState(props.markdown || "");
	const [headerImg, setHeaderImg] = useState(props.header_img);
	const [tags, setTags] = useState(props.tags || []);
	const router = useRouter();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (uploading || !e?.target?.files) return;
		setUploading(true);
		setError({});
		const file = e.target.files[0];
		e.target.value = "";
		uploadFile(file).then((res) => {
			if (res.errors) {
				setError(res.errors);
			} else {
				setHeaderImg(res.data);
			}
			setUploading(false);
		});
	};

	const handleSubmit = () => {
		if (loading) return;
		NProgress.start();
		setLoading(true);
		setError({});
		modifyPost(props.edit, props._id, headerImg, title, tags, markdown).then(
			(res) => {
				NProgress.done();
				// @ts-ignore
				if (res.error) {
					// @ts-ignore
					// @ts-ignore
					if (res.msg) setError(res.msg);
					// @ts-ignore
					else setError(res.errors);
					setLoading(false);
				} else {
					// @ts-ignore
					router.push("/post/" + res.data._id);
				}
			}
		);
	};

	return (
		<section className="p-6 px-20">
			<div className="p-4">
				{/* header image */}
				<div className="flex items-start">
					<label
						htmlFor="header-img"
						className="bg-white py-1 px-2 cursor-pointer border-2  rounded p-2"
					>
						{uploading ? "Uploading" : "Upload Header Image"}
					</label>
					<input
						onChange={handleFileChange}
						id="header-img"
						type="file"
						disabled={loading || uploading}
						accept="image/png,image/jpeg"
						hidden
					/>
					{headerImg ? <img src={headerImg} className="mt-6 h-64" /> : null}
				</div>
				{/* title */}
				<input
					type="text"
					placeholder="Title"
					className="mt-6 p-2 w-full border-2  rounded"
					onChange={(e) => setTitle(e.target.value)}
					value={title}
					disabled={loading}
				/>
				{/* tags */}
				<TagSelector
					disabled={loading}
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
						disabled={loading}
						style={{ minHeight: "16rem" }}
						className="w-2/4 mr-4 p-4 border-2  rounded"
						onChange={(e) =>
							setMarkdown(e.target.value.replaceAll("\n", "\n\n"))
						}
					>
						{props.markdown}
					</textarea>
					<ReactMarkdown
						renderers={renderers}
						plugins={[gfm]}
						// @ts-ignore
						style={{ minHeight: "16rem" }}
						className="w-2/4 ml-4 p-4 markdown border-2  rounded"
						children={markdown}
					/>
				</div>

				<button
					onClick={handleSubmit}
					disabled={loading || uploading}
					className="bg-gradient-1 text-white py-1 px-4 mt-8 m-auto block"
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
